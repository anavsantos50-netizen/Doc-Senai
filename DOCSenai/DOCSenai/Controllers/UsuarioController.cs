
using DOCSenai.Models;
using DOCSenai.Data;

using Microsoft.AspNetCore.Mvc;

namespace DOCSenai.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UsuarioController : ControllerBase
    {
        private readonly DOCSenaiContext _context;

        public UsuarioController(DOCSenaiContext context)
        {
            _context = context;
        }



        [HttpPost("login")]
        public IActionResult Login(Usuario usuario)
        {
            var usuarioBanco = _context.Usuarios.Where
                (u => u.Email.Equals(usuario.Email) &&
                u.Senha.Equals(usuario.Senha)).ToList();
            if (usuarioBanco.Count == 0)
            {
                return Unauthorized("Email ou senha incorretos!");
            }
            HttpContext.Session.SetString("IdLogado", usuarioBanco[0].Id_Usuario.ToString());
            Response.Cookies.Append("IdLogado", usuarioBanco[0].Id_Usuario.ToString(),
                 new CookieOptions
                 {
                     HttpOnly = true,
                     Secure = true,
                     SameSite = SameSiteMode.None
                 });
            return Ok(usuarioBanco[0].Cargo.Trim());
        }

        [HttpPost]
        public IActionResult CadastraUsuario(Usuario usuario)
        {
            _context.Add(usuario);
            _context.SaveChanges();

            return Created("", usuario);
        }

    }
}
   