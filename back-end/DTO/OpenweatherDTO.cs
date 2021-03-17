using System;
using System.Collections.Generic;
using System.Text;

namespace back_end
{
    public class OpenweatherDTO
    {
        public List<OpenweatherInfoPartDayDTO> hourly { get; set; }
        public List<OpenweatherInfoPartWeekDTO> daily { get; set; }
        public City city { get; set; }
    }

    public class OpenweatherInfoPartDTO
    {
        public long dt { get; set; }
        public List<DescriptionInfo> weather { get; set; }
        public double wind_speed { get; set; }
        public double clouds { get; set; }
        
        
    }

    public class DescriptionInfo
    {
        public string description { get; set; }
        public string icon { get; set; }
    }

    public class City
    {
        public string name { get; set; }
    }

    public class OpenweatherInfoPartDayDTO : OpenweatherInfoPartDTO
    {
        public double feels_like { get; set; }
        public double temp { get; set; }
    }

    public class OpenweatherInfoPartWeekDTO : OpenweatherInfoPartDTO
    {
        public FeelsLikeDTO feels_like { get; set; }
        public TempWeekDTO temp { get; set; }
    }

    public class FeelsLikeDTO
    {
        public double day { get; set; }
        public double night { get; set; }
        public double eve { get; set; }
        public double morn { get; set; }
    }
    public class TempWeekDTO
    {
        public double day { get; set; }
        public double night { get; set; }
        public double eve { get; set; }
        public double morn { get; set; }
        public double min { get; set; }
        public double max { get; set; }
    }
}