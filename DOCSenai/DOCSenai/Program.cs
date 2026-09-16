using Microsoft.EntityFrameworkCore;
using DOCSenai.Data;

var builder = WebApplication.CreateBuilder(args);

// =========================================================
// CONTROLLERS
// =========================================================

builder.Services.AddControllers();


// =========================================================
// SESSION
// =========================================================

builder.Services.AddDistributedMemoryCache();

builder.Services.AddDataProtection();

builder.Services.AddSession(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;

    // Permite o cookie da sessão entre origens diferentes
    options.Cookie.SameSite = SameSiteMode.None;

    // O backend está rodando em HTTPS
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
});


// =========================================================
// SWAGGER
// =========================================================

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();


// =========================================================
// BANCO DE DADOS
// =========================================================

builder.Services.AddDbContext<DOCSenaiContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    ));


// =========================================================
// CORS
// =========================================================

builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirFrontend", policy =>
    {
        policy.WithOrigins(
            "http://127.0.0.1:5500",
            "http://localhost:5500"
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});


var app = builder.Build();


// =========================================================
// SWAGGER
// =========================================================

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


// =========================================================
// HTTPS
// =========================================================

app.UseHttpsRedirection();
app.UseStaticFiles();

// =========================================================
// CORS
// =========================================================

app.UseCors("PermitirFrontend");


// =========================================================
// SESSION
// =========================================================

app.UseSession();


// =========================================================
// AUTHORIZATION
// =========================================================

app.UseAuthorization();


// =========================================================
// CONTROLLERS
// =========================================================

app.MapControllers();


// =========================================================
// EXECUÇÃO
// =========================================================

app.Run();