using DOCSenai.Data;
using DOCSenai.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

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


        /* =====================================================
           LOGIN
        ===================================================== */

        [HttpPost("login")]
        public IActionResult Login(Usuario usuario)
        {
            var usuarioBanco = _context.Usuarios
                .Where(u =>
                    u.Email.Equals(usuario.Email) &&
                    u.Senha.Equals(usuario.Senha))
                .ToList();


            if (usuarioBanco.Count == 0)
            {
                return Unauthorized(
                    "Email ou senha incorretos!"
                );
            }


            HttpContext.Session.SetString(
                "IdLogado",
                usuarioBanco[0]
                    .Id_Usuario
                    .ToString()
            );


            Response.Cookies.Append(
                "IdLogado",
                usuarioBanco[0]
                    .Id_Usuario
                    .ToString(),
                new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None
                }
            );


            return Ok(
                usuarioBanco[0]
                    .Cargo
                    .Trim()
            );
        }


        /* =====================================================
           CADASTRAR USUÁRIO
        ===================================================== */

        [HttpPost]
        public IActionResult CadastraUsuario(
            Usuario usuario)
        {
            if (
                string.IsNullOrWhiteSpace(usuario.Nome) ||
                string.IsNullOrWhiteSpace(usuario.Email) ||
                string.IsNullOrWhiteSpace(usuario.Senha) ||
                string.IsNullOrWhiteSpace(usuario.Cargo)
            )
            {
                return BadRequest(
                    "Todos os campos devem ser preenchidos."
                );
            }


            if (usuario.Senha.Length != 8)
            {
                return BadRequest(
                    "A senha deve ter exatamente 8 caracteres."
                );
            }


            if (
                !new EmailAddressAttribute()
                    .IsValid(usuario.Email)
            )
            {
                return BadRequest(
                    "Digite um e-mail válido."
                );
            }


            var emailExistente =
                _context.Usuarios.Any(
                    u =>
                        u.Email.ToLower() ==
                        usuario.Email.ToLower()
                );


            if (emailExistente)
            {
                return BadRequest(
                    "Este e-mail já está cadastrado."
                );
            }


            _context.Add(usuario);

            _context.SaveChanges();


            return Created(
                "",
                usuario
            );
        }


        /* =====================================================
           BUSCAR PERFIL DO USUÁRIO LOGADO
        ===================================================== */

        [HttpGet("perfil")]
        public async Task<IActionResult> BuscarPerfil()
        {
            var idLogado =
                HttpContext.Session
                    .GetString("IdLogado");


            if (string.IsNullOrEmpty(idLogado))
            {
                return Unauthorized(
                    new
                    {
                        mensagem =
                            "Sua sessão expirou. Faça login novamente."
                    }
                );
            }


            if (
                !int.TryParse(
                    idLogado,
                    out int idUsuario
                )
            )
            {
                return Unauthorized(
                    new
                    {
                        mensagem =
                            "Sessão inválida."
                    }
                );
            }


            var usuario =
                await _context.Usuarios
                    .FirstOrDefaultAsync(
                        u =>
                            u.Id_Usuario ==
                            idUsuario
                    );


            if (usuario == null)
            {
                return NotFound(
                    new
                    {
                        mensagem =
                            "Usuário não encontrado."
                    }
                );
            }


            return Ok(
                new
                {
                    id = usuario.Id_Usuario,
                    nome = usuario.Nome,
                    email = usuario.Email,
                    cargo = usuario.Cargo.Trim()
                }
            );
        }


        /* =====================================================
           ALTERAR PERFIL
        ===================================================== */

        [HttpPut("perfil")]
        public async Task<IActionResult> AlterarPerfil(
            [FromBody] AlterarPerfilRequest request)
        {
            var idLogado =
                HttpContext.Session
                    .GetString("IdLogado");


            if (string.IsNullOrEmpty(idLogado))
            {
                return Unauthorized(
                    new
                    {
                        mensagem =
                            "Sua sessão expirou. Faça login novamente."
                    }
                );
            }


            if (
                !int.TryParse(
                    idLogado,
                    out int idUsuario
                )
            )
            {
                return Unauthorized(
                    new
                    {
                        mensagem =
                            "Sessão inválida."
                    }
                );
            }


            if (request == null)
            {
                return BadRequest(
                    new
                    {
                        mensagem =
                            "Dados inválidos."
                    }
                );
            }


            if (
                string.IsNullOrWhiteSpace(
                    request.Nome
                ) ||
                string.IsNullOrWhiteSpace(
                    request.Email
                )
            )
            {
                return BadRequest(
                    new
                    {
                        mensagem =
                            "Nome e e-mail são obrigatórios."
                    }
                );
            }


            if (
                !new EmailAddressAttribute()
                    .IsValid(request.Email)
            )
            {
                return BadRequest(
                    new
                    {
                        mensagem =
                            "Digite um e-mail válido."
                    }
                );
            }


            var usuario =
                await _context.Usuarios
                    .FirstOrDefaultAsync(
                        u =>
                            u.Id_Usuario ==
                            idUsuario
                    );


            if (usuario == null)
            {
                return NotFound(
                    new
                    {
                        mensagem =
                            "Usuário não encontrado."
                    }
                );
            }


            /*
             * Verifica se o e-mail já pertence
             * a outro usuário.
             */
            var emailExistente =
                await _context.Usuarios
                    .AnyAsync(
                        u =>
                            u.Id_Usuario != idUsuario &&
                            u.Email.ToLower() ==
                            request.Email.ToLower()
                    );


            if (emailExistente)
            {
                return BadRequest(
                    new
                    {
                        mensagem =
                            "Este e-mail já está cadastrado."
                    }
                );
            }


            /*
             * Atualiza somente nome e e-mail.
             *
             * O cargo não é alterado pelo perfil.
             */
            usuario.Nome =
                request.Nome.Trim();

            usuario.Email =
                request.Email.Trim();


            await _context.SaveChangesAsync();


            return Ok(
                new
                {
                    mensagem =
                        "Perfil atualizado com sucesso.",

                    nome = usuario.Nome,

                    email = usuario.Email,

                    cargo = usuario.Cargo.Trim()
                }
            );
        }


        /* =====================================================
           ALTERAR SENHA
        ===================================================== */

        [HttpPut("senha")]
        public async Task<IActionResult> AlterarSenha(
            [FromBody] AlterarSenhaRequest request)
        {
            var idLogado =
                HttpContext.Session
                    .GetString("IdLogado");


            if (string.IsNullOrEmpty(idLogado))
            {
                return Unauthorized(
                    new
                    {
                        mensagem =
                            "Sua sessão expirou. Faça login novamente."
                    }
                );
            }


            if (
                !int.TryParse(
                    idLogado,
                    out int idUsuario
                )
            )
            {
                return Unauthorized(
                    new
                    {
                        mensagem =
                            "Sessão inválida."
                    }
                );
            }


            if (request == null)
            {
                return BadRequest(
                    new
                    {
                        mensagem =
                            "Dados inválidos."
                    }
                );
            }


            if (
                string.IsNullOrWhiteSpace(
                    request.SenhaAtual
                ) ||
                string.IsNullOrWhiteSpace(
                    request.NovaSenha
                )
            )
            {
                return BadRequest(
                    new
                    {
                        mensagem =
                            "Preencha todos os campos."
                    }
                );
            }


            /*
             * O cadastro do sistema exige
             * exatamente 8 caracteres.
             */
            if (request.NovaSenha.Length != 8)
            {
                return BadRequest(
                    new
                    {
                        mensagem =
                            "A nova senha deve ter exatamente 8 caracteres."
                    }
                );
            }


            var usuario =
                await _context.Usuarios
                    .FirstOrDefaultAsync(
                        u =>
                            u.Id_Usuario ==
                            idUsuario
                    );


            if (usuario == null)
            {
                return NotFound(
                    new
                    {
                        mensagem =
                            "Usuário não encontrado."
                    }
                );
            }


            /*
             * Confere a senha atual.
             */
            if (usuario.Senha != request.SenhaAtual)
            {
                return BadRequest(
                    new
                    {
                        mensagem =
                            "A senha atual está incorreta."
                    }
                );
            }


            /*
             * Impede usar a mesma senha.
             */
            if (usuario.Senha == request.NovaSenha)
            {
                return BadRequest(
                    new
                    {
                        mensagem =
                            "A nova senha deve ser diferente da senha atual."
                    }
                );
            }


            usuario.Senha =
                request.NovaSenha;


            await _context.SaveChangesAsync();


            return Ok(
                new
                {
                    mensagem =
                        "Senha alterada com sucesso."
                }
            );
        }
    }


    /* =========================================================
       REQUEST — ALTERAR PERFIL
    ========================================================= */

    public class AlterarPerfilRequest
    {
        public string Nome { get; set; }

        public string Email { get; set; }
    }


    /* =========================================================
       REQUEST — ALTERAR SENHA
    ========================================================= */

    public class AlterarSenhaRequest
    {
        public string SenhaAtual { get; set; }

        public string NovaSenha { get; set; }
    }
}