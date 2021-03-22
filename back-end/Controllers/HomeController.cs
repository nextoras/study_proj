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
using back_end.Interfaces;

namespace back_end.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IConfiguration _configuration;
        private readonly IHomeService _homeService;

        public HomeController(ILogger<HomeController> logger, IConfiguration configuration, IHomeService homeService)
        {
            _logger = logger;
            _configuration = configuration;
            _homeService = homeService;
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
        public async Task<IActionResult> GetInfo(float? flat, float? len, string city)
        {
            try
            {
                var result = await _homeService.GetInfoAsync(flat, len, city);

                return Ok(result);
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
    }
}
