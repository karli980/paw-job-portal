<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JobPortal</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6fb; font-family:Arial,Helvetica,sans-serif; color:#334155;">

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f6fb;">
        <tr>
            <td align="center" style="padding:40px 15px;">

                <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px;">

                    <tr>
                        <td align="center" style="padding:20px 0 30px;">
                            <span style="font-size:28px; font-weight:bold; color:#4f46e5;">
                                JobPortal
                            </span>
                        </td>
                    </tr>

                    <tr>
                        <td style="background-color:#ffffff; padding:40px 35px; border-radius:12px;">

                            @yield('content')

                        </td>
                    </tr>

                    <tr>
                        <td align="center" style="padding:25px 15px; color:#94a3b8; font-size:12px; line-height:20px;">
                            Este es un correo automático de JobPortal.
                            <br>
                            Por favor, no respondas a este mensaje.
                            <br>
                            &copy; {{ date('Y') }} JobPortal. Todos los derechos reservados.
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>
</html>
