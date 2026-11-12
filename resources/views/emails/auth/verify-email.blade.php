@extends('emails.layout')

@section('content')
    <h1 style="margin:0 0 20px; color:#1e293b; font-size:24px;">
        JOBPORTAL - TALENTMATCH
    </h1>

    <p style="font-size:15px; line-height:25px; color:#475569;">
        Hola {{ $user->nombre }},
    </p>

    <p style="font-size:15px; line-height:25px; color:#475569;">
        Gracias por registrarte en JobPortal. Para completar tu registro
        y comenzar a utilizar la plataforma, necesitamos confirmar
        tu dirección de correo electrónico.
    </p>

    <p style="font-size:15px; line-height:25px; color:#475569;">
        Hacé clic en el siguiente botón para verificar tu cuenta:
    </p>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:30px auto;">
        <tr>
            <td align="center" bgcolor="#4f46e5" style="border-radius:8px;">
                <a href="{{ $url }}"
                    style="display:inline-block; padding:15px 28px; color:#ffffff; font-size:15px; font-weight:bold; text-decoration:none;">
                    Verificar mi correo electrónico
                </a>
            </td>
        </tr>
    </table>

    <p style="font-size:13px; line-height:22px; color:#64748b;">
        Si el botón no funciona, copiá y pegá el siguiente enlace
        en tu navegador:
    </p>

    <p style="font-size:12px; line-height:20px; word-break:break-all;">
        <a href="{{ $url }}" style="color:#4f46e5;">
            {{ $url }}
        </a>
    </p>

    <p style="margin-top:25px; font-size:13px; line-height:22px; color:#64748b;">
        Si no creaste una cuenta en JobPortal, podés ignorar este mensaje.
    </p>

    <p style="font-size:15px; color:#475569;">
        ¡Gracias por confiar en nosotros!
        <br>
        <strong>El equipo de JobPortal</strong>
    </p>
@endsection
