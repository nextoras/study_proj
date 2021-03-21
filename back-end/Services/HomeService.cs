using back_end.Interfaces;
using System.Threading.Tasks;
using System;
using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using back_end.Models;
using System.Net;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using Newtonsoft.Json.Linq;
using Microsoft.AspNetCore.Http;
using System.Net.Http;
using System.Net.Http.Headers;

namespace back_end.Services
{
    /// <summary>
    /// Email service.
    /// </summary>
    public class HomeService : IHomeService
    {
        private readonly IConfiguration _configuration;
        private readonly string requestUri = "https://api.openweathermap.org/data/2.5/onecall?lat={0}&lon={1}&units=metric&appid={2}&exclude=current,minutely,alerts&lang={3}";
        private readonly string requestCoordinatesUri = "https://api.openweathermap.org/data/2.5/weather?q={0}&appid={1}";
        public HomeService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        /// <summary>
        /// Собираем и упаковываем данные
        /// </summary>
        public async Task<InfoDTO> GetInfoAsync(float flat, float len, string city)
        {
            if (city != null && city != "")
            {
                var coordinates = await GetCoordinates(city);

                flat = coordinates.coord.lat;
                len = coordinates.coord.lon;
            }

            string language = SetLanguage(city);

            var info = await GetInfoFromOpenWeather(flat, len, language);

            var infoDTO = mappingToEntity(info, language);

            return infoDTO;
        }

        /// <summary>
        /// Получаем данные от Openweather и десериализуем
        /// </summary>
        private async Task<OpenweatherDTO> GetInfoFromOpenWeather(float lat, float len, string language)
        {
            try
            {
                string apiKey = _configuration["ApiKey"];
                string url = string.Format(requestUri, lat, len, apiKey, language);

                HttpClient client = new HttpClient();

                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                client.BaseAddress = new Uri(url);
                client.DefaultRequestHeaders.Add("Accept", "application/json");
                var response = await client.GetAsync("");

                if (response == null || response.StatusCode != HttpStatusCode.OK)
                {
                    throw new ArgumentException("При запросе данных о погоде произошла ошибка");
                }

                var resultString = response.Content.ReadAsStringAsync();
                var result = response.Content.ReadAsAsync<OpenweatherDTO>().Result;

                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        /// <summary>
        /// Узнаём координаты по городу
        /// </summary>
        private async Task<CoordinatesDTO> GetCoordinates(string city)
        {
            try
            {
                string apiKey = _configuration["ApiKey"];
                string url = string.Format(requestCoordinatesUri, city, apiKey);
                var webClient = new WebClient();

                var content = webClient.DownloadString(url);
                if (content == null)
                {
                    throw new ArgumentException("Город пустой либо не валидный");
                }

                HttpClient client = new HttpClient();

                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                client.BaseAddress = new Uri(url);
                client.DefaultRequestHeaders.Add("Accept", "application/json");
                var response = await client.GetAsync("");

                var result = response.Content.ReadAsAsync<CoordinatesDTO>().Result;

                return result;
            }
            catch
            {
                throw;
            }
        }

        /// <summary>
        ///  Мапим в наше DTO
        /// </summary>
        private InfoDTO mappingToEntity(OpenweatherDTO openweatherDTO, string lang)
        {
            //строка с фразой для ксюхи
            string phraze = string.Empty;


            InfoDTO dto = new InfoDTO()
            {
                dayInfo = new List<InfoPartDTO>(),
                weekInfo = new List<InfoPartDTO>()
            };


            foreach (var item in openweatherDTO.hourly)
            {
                DateTime date = UnixTimeStampToDateTime(item.dt).ToLocalTime();
                if (date.Day == DateTime.Today.Day && date.Hour > DateTime.Now.Hour)
                {
                    //добавление фразы Ксюхи для дня
                    phraze = SendPhraze(lang, item.clouds, item.temp);
                    
                    InfoPartDTO day = new InfoPartDTO();
                    day.dateTime = item.dt;
                    day.clouds = item.clouds;
                    day.description = item.weather[0].description;
                    day.temperature = item.temp;
                    day.wind = item.wind_speed;
                    day.feels_like = item.feels_like;
                    day.icon = item.weather[0].icon;
                    day.textFromKsu = phraze;
                    dto.dayInfo.Add(day);
                }
            }

            foreach (var item in openweatherDTO.daily)
            {
                DateTime date = UnixTimeStampToDateTime(item.dt).ToLocalTime();

                if (date.Day > DateTime.Now.Day)
                {
                    //добавление фразы Ксюхи для недели
                    phraze = SendPhraze(lang, item.clouds, item.temp.day);

                    InfoPartDTO week = new InfoPartDTO();
                    week.dateTime = item.dt;
                    week.clouds = item.clouds;
                    week.description = item.weather[0].description;
                    week.temperature = item.temp.day;
                    week.wind = item.wind_speed;
                    week.textFromKsu = phraze;
                    week.feels_like = item.feels_like.day;
                    week.icon = item.weather[0].icon;
                    dto.weekInfo.Add(week);
                }
            }
            return dto;
        }

        /// <summary>
        ///  Перевод TimeStamp в Дату
        /// </summary>
        private static DateTime UnixTimeStampToDateTime(long unixTimeStamp)
        {
            // Unix timestamp is seconds past epoch
            System.DateTime dtDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, System.DateTimeKind.Utc);
            dtDateTime = dtDateTime.AddSeconds(unixTimeStamp).ToLocalTime();
            return dtDateTime;
        }

        /// <summary>
        /// Взависимости от языка вызываем метод получения фразы на русском или английском
        /// </summary>
        /// <param name="lang">язык в формате "ru"/"en"</param>
        /// <param name="cloud">облачность</param>
        /// <param name="temperature">температура</param>
        /// <returns>фраза на выбранном языке</returns>
        private string SendPhraze(string lang, double cloud, double temperature)
        {
            string phraze = string.Empty;
            if (lang == "ru")
            {
                phraze = GetRuPhraze(cloud, temperature);
            }
            else
            {
                phraze = GetEnPhraze(cloud, temperature);
            }
            return phraze;
        }

        /// <summary>
        /// взависимости от облачности и температуры возвращает определенную фразу на руссуком.
        /// </summary>
        /// <param name="cloud">облачность</param>
        /// <param name="temperature">температура</param>
        /// <returns>фраза на русском</returns>
        private string GetRuPhraze(double cloud, double temperature)
        {
            string phraza = String.Empty;
            if (cloud <= 50.0)
            {
                if (temperature >= 30.0 && temperature <= 40.0)
                {
                    phraza = "За окном жара. Спасает легкая одежда и легкая надежда на дождь";
                }
                if (temperature < 30.0 && temperature >= 25.0)
                {
                    phraza = "За окном жара! Пей побольше воды и не забывай панамку.";
                }
                if (temperature < 25.0 && temperature >= 20.0)
                {
                    phraza = "Время загорать! Но не стоит забывать про солнцезащитный крем.";
                }
                if (temperature < 20.0 && temperature >= 10.0)
                {
                    phraza = "Не стоит упускать возможность насладиться хорошей погодой.";
                }
                if (temperature < 10.0 && temperature >= 0.0)
                {
                    phraza = "На улице довольно холодно, стоит надеть свитер.";
                }
                if (temperature < 0.0 && temperature >= -15.0)
                {
                    phraza = "На улице похолодало. Шапка и перчатки будут отличной идеей.";
                }
                if (temperature < -15.0 && temperature >= -20.0)
                {
                    phraza = "Брр, время доставать зимние вещи из шкафа.";
                }
                if (temperature < -20.0 && temperature >= -30.0)
                {
                    phraza = " В такую погоду не обойтись без шапки и шарфа.";
                }
                if (temperature < -30.0)
                {
                    phraza = "Не глупи, оставайся дома под пледом и с какао.";
                }
            }
            else
            {
                if (temperature <= 30.0 && temperature > 10.0)
                {
                    phraza = "Сегодня может пойти дождь. Захвати с собой дождевик.";
                }
                if (temperature <= 10.0 && temperature > 0.0)
                {
                    phraza = "за окном дожди. Не забудь свой зонт.";
                }
                if (temperature <= 0.0 && temperature > -10.0)
                {
                    phraza = "Не забудь надеть теплые носки.";
                }
                if (temperature <= -10.0 && temperature > -20.0)
                {
                    phraza = "Если ты не надел теплую куртку, я уже звоню твоей маме….";
                }
                if (temperature <= -20.0 && temperature > -30.0)
                {
                    phraza = "За окном холодно и снежно. Одевайся потеплее, !";
                }
                if (temperature < -30.0)
                {
                    phraza = "По возможности, оставайся дома под пледом и с какао.";
                }
            }
            return phraza;
        }
        /// <summary>
        /// взависимости от облачности и температуры возвращает определенную фразу на английском.
        /// </summary>
        /// <param name="cloud">облачность</param>
        /// <param name="temperature">температура</param>
        /// <returns>фраза на английском</returns>
        private string GetEnPhraze(double cloud, double temperature)
        {
            string phraza = String.Empty;
            if (cloud < 50.0)
            {
                if (temperature >= 30.0 && temperature <= 40.0)
                {
                    phraza = "It's hot outside. Light clothing and light hope for rain save you.";
                }
                if (temperature < 30 && temperature >= 25)
                {
                    phraza = "It's hot outside! Drink plenty of water and don't forget your panama hat.";
                }
                if (temperature < 25 && temperature >= 20)
                {
                    phraza = "00, time to sunbathe! But do not forget about sunscreen and a cap.";
                }
                if (temperature < 20 && temperature >= 10)
                {
                    phraza = "Do not miss the opportunity to enjoy the good weather, Name.";
                }
                if (temperature < 10 && temperature >= 0)
                {
                    phraza = "Name, it's quite cold outside, you should wear a sweater.";
                }
                if (temperature < 0 && temperature >= -15.0)
                {
                    phraza = "It's getting colder outside. A hat and gloves would be a great idea.";
                }
                if (temperature < -15.0 && temperature >= -20.0)
                {
                    phraza = "Brr, time to get winter clothes out of the closet.";
                }
                if (temperature < -20.0 && temperature >= -30.0)
                {
                    phraza = "In this weather, you can not do without a hat and scarf.";
                }
                if (temperature < -30)
                {
                    phraza = "Don't be silly, stay at home under a blanket and with cocoa.";
                }
            }
            else
            {
                if (temperature <= 30 && temperature > 10)
                {
                    phraza = "It may rain today. Bring a raincoat with you.";
                }
                if (temperature <= 10 && temperature > 0)
                {
                    phraza = "Name, rain outside the window. Don't forget your umbrella.";
                }
                if (temperature <= 0 && temperature > -10)
                {
                    phraza = "Don't forget to wear warm socks, Name.";
                }
                if (temperature <= -10 && temperature > -20)
                {
                    phraza = "Name, if you're not wearing a warm jacket, I'm already calling your mom....";
                }
                if (temperature <= -20 && temperature > -30)
                {
                    phraza = "It's cold and snowy outside. Dress warmly, !";
                }
                if (temperature < -30)
                {
                    phraza = "If possible, stay at home under a blanket and with cocoa.";
                }
            }
            return phraza;
        }

        /// <summary>
        /// Detect language from input string
        /// </summary>
        /// <param name="text"></param>
        private string SetLanguage(string text)
        {
            //по факту без разницы что придет в качестве входной строки, по 1 букве определяется принадлежность к языку
            if (text == null) return "en";
            text = text.ToLower();
            if (text[0] > 'а' && text[0] <= 'я')
            {
                return "ru";
            }
            else return "en";
        }
    }
}