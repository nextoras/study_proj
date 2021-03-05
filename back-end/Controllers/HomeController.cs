using System;
using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using back_end.Models;
using System.Net;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using Newtonsoft.Json.Linq;

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
            string ApiKey = _configuration["ApiKey"];
            string url = string.Format("pro.openweathermap.org/data/2.5/forecast/hourly?q={0}&appid={1}", City, ApiKey);
            string content;
            var webClient = new WebClient();
           try
            {
                content = webClient.DownloadString(url);
                return Content(content);
            }
            catch
            {
                return Ok("Че-то пошло по пи*(город - пустой)");
            }


        }

        public IActionResult GetWeatherFromLatLen(string Flat, string Len)
        {
            string ApiKey = _configuration["ApiKey"];
            string url = string.Format("https://api.openweathermap.org/data/2.5/forecast?lat={0}&lon={1}&units=metric&appid={2}", Flat, Len, ApiKey);
            var webClient = new WebClient();
            try 
            {
                var content = webClient.DownloadString(url);
                return Content(content);
            }
            catch
            {
                return Ok("сервис ёкнулся (пришли пустые параметры lat & len)");
            }


        }

        
        /// <summary>
        /// Returns info about weather full
        /// </summary>
        /// <param name="flat">flat</param>
        /// <param name="len">len</param>
        /// <param name="city">city</param>
        /// <returns></returns>
        [HttpPost]
        public IActionResult GetInfo(string flat, string len, string city)
        {
            try
            {
                string ApiKey = "ae4b4e0ee9db8f4040b03a514cf7a928";

                // var uri = базовый uri

                //добавочный uri для случая с городом, но ещё без подстановки
                var uriCity = "https://api.openweathermap.org/data/2.5/weather?q={0}&appid={1}";

                //добавочный uri для координат без подстановки
                var uriCoordinates = "https://api.openweathermap.org/data/2.5/forecast?lat={0}&lon={1}&units=metric&appid={2}";

                string content;
                var webClient = new WebClient();
                //content = webClient.DownloadString("uri");

                
                //if (определить есть ли город) сформировать корректный uri для запроса uri = итоговый uri, учитывать русский язык
                if (city!=null||city.Length!=0)
                {
                    var uriFromCity = string.Format("https://api.openweathermap.org/data/2.5/weather?q={0}&appid={1}", city, ApiKey);
                    content = webClient.DownloadString(uriFromCity);
                    var coord = JObject.Parse(content)["coord"].ToString();
                    var lat = JObject.Parse(coord)["lat"].ToString();
                    var lon = JObject.Parse(coord)["lon"].ToString();
                    var uriCoordinat =string.Format( "https://api.openweathermap.org/data/2.5/forecast?lat={0}&lon={1}&units=metric&appid={2}",lat,lon,ApiKey);
                }
                else
                {
                    if(flat!=null&&len!=null)
                    {
                        var uriCoordinat = string.Format("https://api.openweathermap.org/data/2.5/forecast?lat={0}&lon={1}&units=metric&appid={2}", flat, len, ApiKey);
                    }                    
                }
                ///если запрос по городу, то мы делаем запрос, чтобы получить координаты и после этого делаем запрос по ним
                ///если запрос по координатам, то всё ок


                //десериализация данных 
                //info result = JsonConvert.DeserializeObject<InfoDTO>(jsonstring);

                //метод формирования дто для дня

                //метод формирования дто для недели

                List<InfoPartDTO> dayInfo = new List<InfoPartDTO>();

                InfoDTO dto = new InfoDTO()
                {
                    
                };

                return Content(content);
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
    }
}
