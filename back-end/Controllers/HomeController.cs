﻿using System;
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
using System.Threading.Tasks;

namespace back_end.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IConfiguration _configuration;

        public HomeController(ILogger<HomeController> logger, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [HttpPost]
        public IActionResult GetWeatherFromCity(string City)
        {
            try
            {
                string ApiKey = "ae4b4e0ee9db8f4040b03a514cf7a928";
                string url = string.Format("https://api.openweathermap.org/data/2.5/weather?q={0}&appid={1}", City, ApiKey);
                var webClient = new WebClient();

                var content = webClient.DownloadString(url);
                if (content == null)
                {
                    throw new ArgumentException("Город пустой либо не валидный");
                }
                return Content(content);
            }
            catch
            {
                throw;
            }

        }
        /// <summary>
        /// Detect language from input string
        /// </summary>
        /// <param name="text"></param>
        public string SetLanguage(string text)
        {
            //по факту без разницы что придет в качестве входной строки, по 1 букве определяется принадлежность к языку
            text = text.ToLower();
            if (text[0] > 'а' && text[0] <= 'я')
            {
                return "ru";
            }
            else return "en";
        }
        public IActionResult GetWeatherFromLatLen(string Flat, string Len)
        {
            try
            {
                string ApiKey = "ae4b4e0ee9db8f4040b03a514cf7a928";
                string url = string.Format("https://api.openweathermap.org/data/2.5/forecast?lat={0}&lon={1}&units=metric&appid={2}", Flat, Len, ApiKey);
                var webClient = new WebClient();
                var content = webClient.DownloadString(url);
                if (content == null)
                {
                    throw new ArgumentException("Широта или долгота не валидны");
                }
                return Content(content);
            }
            catch (ArgumentException)
            {
                throw;
            }
        }
        public IActionResult GetWeatherFromLatLen7days(string Flat, string Len)
        {
            try
            {
                string ApiKey = "ae4b4e0ee9db8f4040b03a514cf7a928";
                string url = string.Format("https://api.openweathermap.org/data/2.5/onecall?lat={0}&lon={1}&exclude=current,minutely,hourly,alerts&appid={2}", Flat, Len, ApiKey);
                var webClient = new WebClient();
                var content = webClient.DownloadString(url);
                if (content == null)
                {
                    throw new ArgumentException("Широта или долгота не валидны");
                }
                return Content(content);
            }
            catch (ArgumentException)
            {
                throw;
            }
        }

        /// <summary>
        /// Returns info about weather full
        /// </summary>
        /// <param name="flat">flat</param>
        /// <param name="len">len</param>
        /// <param name="city">city</param>
        /// <param name="language">city</param>
        /// <param name="format">city</param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> GetInfo(float flat, float len, string city, string format)
        {
            try
            {
                string apiKey = _configuration["ApiKey"];

                if (city != null && city != "")
                {
                    var coordinates = await GetCoordinates(city, apiKey);

                    flat = coordinates.coord.lat;
                    len = coordinates.coord.lon;
                }
                string language = "ru";
                var info = await GetInfoFromOpenWeather(flat, len, apiKey, language, format);

                var infoDTO = await mappingToEntity(info,language);

                List<InfoPartDTO> dayInfo = new List<InfoPartDTO>();

                InfoDTO dto = new InfoDTO()
                {

                };

                return Ok(infoDTO);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        private async Task<CoordinatesDTO> GetCoordinates(string city, string apiKey)
        {
            try
            {
                string url = string.Format("https://api.openweathermap.org/data/2.5/weather?q={0}&appid={1}", city, apiKey);
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

        private async Task<OpenweatherDTO> GetInfoFromOpenWeather(float lat, float len, string apiKey, string language, string format)
        {
            try
            {
                string url = string.Format("https://api.openweathermap.org/data/2.5/onecall?lat={0}&lon={1}&units=metric&appid={2}&exclude={3}&lang={4}", lat, len, apiKey, format, language);

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
        private async Task<InfoDTO> mappingToEntity(OpenweatherDTO openweatherDTO,string lang)
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
                //добавление фразы Ксюхи для дня
                phraze = SendPhraze(lang, item.clouds, item.temp);

                DateTime date = UnixTimeStampToDateTime(item.dt).ToLocalTime();
                if (date.Day == DateTime.Today.Day && date.Hour > DateTime.Now.Hour)
                {
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

                //добавление фразы Ксюхи для недели
                phraze = SendPhraze(lang, item.clouds, item.temp.day);

                if (date.Day > DateTime.Now.Day)
                {
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

        private DateTime SetDate(string date)
        {
            return DateTime.ParseExact(date, "yyyy-MM-dd HH:mm:ss", System.Globalization.CultureInfo.InvariantCulture);
        }

        public static DateTime UnixTimeStampToDateTime(long unixTimeStamp)
        {
            // Unix timestamp is seconds past epoch
            System.DateTime dtDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, System.DateTimeKind.Utc);
            dtDateTime = dtDateTime.AddSeconds(unixTimeStamp).ToLocalTime();
            return dtDateTime;
        }
    }
}
