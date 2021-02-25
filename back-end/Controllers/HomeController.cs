using System;
using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using back_end.Models;
using System.Net;


namespace back_end.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
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
            string ApiKey = "ae4b4e0ee9db8f4040b03a514cf7a928";
            string url = string.Format("pro.openweathermap.org/data/2.5/forecast/hourly?q={0}&appid={1}", City, ApiKey);
            string content;
            var webClient = new WebClient();
            try
            {
                content = webClient.DownloadString(url);
                return Content(content);
            }
            catch(ArgumentException)
            {
                return View("/Shared/Error");
            }            
        }

        public IActionResult GetWeatherFromLatLen(string Flat, string Len)
        {
            string ApiKey = "ae4b4e0ee9db8f4040b03a514cf7a928";
            string url = string.Format("https://api.openweathermap.org/data/2.5/forecast?lat={0}&lon={1}&units=metric&appid={2}", Flat, Len, ApiKey);
            var webClient = new WebClient();
            try
            {
                var content = webClient.DownloadString(url);
                return Content(content);
            }
            catch(ArgumentException)
            {
                return View("/Shared/Error");
            }
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
