using System;
using System.Collections.Generic;
using System.Text;

namespace back_end
{
    public class UnexpectedException : Exception
    {
        public UnexpectedException(string message) : base(message) { }

        
    }
}