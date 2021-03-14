using System;
using System.Collections.Generic;
using System.Text;

namespace back_end
{
    public class OpenweatherDTO
    {
        public List<OpenweatherInfoPartDTO> list { get; set; }
        public City city{ get; set; }
    }

    public class OpenweatherInfoPartDTO
    {
        public long dt{ get; set; }
        public MainInfo main{ get; set; }
        public List<DescriptionInfo> weather{ get; set; }
        public Wind wind{ get; set; }
        public CloudsInfo clouds{ get; set; }
        public string dt_txt{set;get;}
    }
    public class MainInfo
    {        
        public double temp{ get; set; }
        public double feels_like{ get; set; }                    
    }

    public class DescriptionInfo
    {
        public string description{ get; set; }
    }
    public class CloudsInfo
    {
        public long all{ get; set; }
    }
    public class Wind
    {
        public long speed{ get; set; }
    }
    public class City
    { 
        public string name { get; set; }
    }
}