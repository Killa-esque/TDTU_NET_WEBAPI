// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace AirBnBWebApi.Services.Helper;
public class SmtpSettings
{
    public string Server { get; set; }
    public int Port { get; set; }
    public string Username { get; set; }
    public string Password { get; set; }
    public string SenderEmail { get; set; }
    public string SenderName { get; set; }
    public bool UseSsl { get; set; }
}

// var placeholders = new Dictionary<string, string>
// {
//     { "Subject", "Welcome to Our Service!" },
//     { "UserName", "John Doe" },
//     { "MessageBody", "We are thrilled to have you onboard. Please click below to confirm your email." },
//     { "ActionUrl", "https://yourwebsite.com/confirm-email" },
//     { "ActionText", "Confirm Email" },
//     { "PrivacyPolicyUrl", "https://yourwebsite.com/privacy-policy" },
//     { "ContactUsUrl", "https://yourwebsite.com/contact" }
// };

//     string emailContent = _emailHelper.GetEmailTemplate("StandardEmailTemplate", placeholders);
//     await _emailHelper.SendEmailAsync("user@example.com", "Welcome to Our Service!", emailContent);

public class EmailHelper
{
    private readonly IConfiguration _configuration;

    public EmailHelper(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string GetEmailTemplate(string templateName, Dictionary<string, string> placeholders)
    {
        var templatePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "templates", $"{templateName}.html");

        if (!File.Exists(templatePath))
        {
            throw new FileNotFoundException($"Template {templateName} not found at {templatePath}");
        }

        var templateContent = File.ReadAllText(templatePath);

        foreach (var placeholder in placeholders)
        {
            templateContent = templateContent.Replace($"{{{{{placeholder.Key}}}}}", placeholder.Value);
        }

        return templateContent;
    }

    public async Task<bool> SendEmailAsync(string toEmail, string subject, string body)
    {
        var smtpSettings = _configuration.GetSection("SmtpSettings").Get<SmtpSettings>();
        var smtpClient = new SmtpClient(smtpSettings.Server)
        {
            Port = smtpSettings.Port,
            Credentials = new NetworkCredential(smtpSettings.Username, smtpSettings.Password),
            EnableSsl = smtpSettings.UseSsl,
        };

        var mailMessage = new MailMessage
        {
            From = new MailAddress(smtpSettings.SenderEmail, smtpSettings.SenderName),
            Subject = subject,
            Body = body,
            IsBodyHtml = true,
        };

        mailMessage.To.Add(toEmail);

        try
        {
            await smtpClient.SendMailAsync(mailMessage).ConfigureAwait(false);
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Failed to send email: {ex.Message}");
            return false;
        }

    }
}
