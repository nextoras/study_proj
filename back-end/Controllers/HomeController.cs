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
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

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
                if(content==null)
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
                string url = string.Format("https://api.openweathermap.org/data/2.5/onecall?lat={0}.8304307&lon={1}&exclude=current,minutely,hourly,alerts&appid={2}", Flat, Len, ApiKey);
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
        public async  Task<IActionResult> GetInfo(float flat, float len, string city, string format)
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
                string language = SetLanguage(city);
                var info = await GetInfoFromOpenWeather(flat, len, apiKey, language, format);

                var infoDTO = mappingToEntity(info);

                //метод формирования дто для дня

                //метод формирования дто для недели

                List<InfoPartDTO> dayInfo = new List<InfoPartDTO>();

                InfoDTO dto = new InfoDTO()
                {
                    
                };

                return Content("");
            }
            catch
            {
                return Ok("Че-то пошло по пи*(город - пустой)");
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
                if(content==null)
                {
                    throw new ArgumentException("Город пустой либо не валидный");
                }

                HttpClient client = new HttpClient();

                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                client.BaseAddress = new Uri(url);
                client.DefaultRequestHeaders.Add("Accept", "application/json");
                var response = await client.GetAsync("" );    

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
                string url = string.Format("https://api.openweathermap.org/data/2.5/forecast?lat={0}&lon={1}&units=metric&appid={2}&exclude={3}&lang={4}", lat, len, apiKey, format, language);

                HttpClient client = new HttpClient();

                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                client.BaseAddress = new Uri(url);
                client.DefaultRequestHeaders.Add("Accept", "application/json");
                var response = await client.GetAsync("" ); 
                
                if(response==null || response.StatusCode != HttpStatusCode.OK)
                {
                    throw new ArgumentException("При запросе данных о погоде произошла ошибка");
                }   

                var resultString = response.Content.ReadAsStringAsync();
                var result = response.Content.ReadAsAsync<OpenweatherDTO>().Result;

                return result;
            }
            catch(Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        private async Task<InfoDTO> mappingToEntity(OpenweatherDTO openweatherDTO)
        {
            InfoDTO dto = new InfoDTO()
            {
                dayInfo = new List<InfoPartDTO>(),
                weekInfo = new List<InfoPartDTO>()
            };
            InfoPartDTO day = new InfoPartDTO();
            InfoPartDTO week = new InfoPartDTO();
            foreach (var item in openweatherDTO.list)
            {
                if(DateTime.Today==item.main.Date)
                {
                    day.SetDate(item.dt_txt);
                    day.city = openweatherDTO.city.name;
                    day.clouds = item.clouds.all;
                    day.date = item.main.Date;
                    day.description = item.weather[0].description;
                    day.temperature = item.main.temp;
                    day.wind = item.wind.speed;
                    dto.dayInfo.Add(day);
                }
                week.city = openweatherDTO.city.name;
                week.clouds = item.clouds.all;
                week.date = item.main.Date;
                week.description = item.weather[0].description;
                week.temperature = item.main.temp;
                week.wind = item.wind.speed;
                dto.weekInfo.Add(week);
            }

            return dto;
        }

        public static DateTime UnixTimeStampToDateTime( long unixTimeStamp )
        {
            // Unix timestamp is seconds past epoch
            System.DateTime dtDateTime = new DateTime(1970,1,1,0,0,0,0,System.DateTimeKind.Utc);
            dtDateTime = dtDateTime.AddSeconds( unixTimeStamp ).ToLocalTime();
            return dtDateTime;
        }
    }
}
