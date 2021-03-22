using System;
using System.Collections.Generic;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace back_end.Interfaces
{
    public interface IHomeService
    {
        Task<InfoDTO> GetInfoAsync(float? flat, float? len, string city);
    }
}