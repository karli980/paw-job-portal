 @extends('emails.layout')

@section('content')
    <h1 style="margin:0 0 20px; color:#1e293b; font-size:24px;">
        Restablecimiento de contraseña
    </h1>

    <p style="font-size:15px; line-height:25px; color:#475569;">
        Hola {{ $user->nombre }},
    </p>

    <p style="font-size:15px; line-height:25px; color:#475569;">
        Recibimos una solicitud para restablecer la contraseña de tu cuenta
        de JobPortal.
    </p>

    <p style="font-size:15px; line-height:25px; color:#475569;">
        Para crear una nueva contraseña, hacé clic en el siguiente botón:
    </p>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:30px auto;">
        <tr>
            <td align="center" bgcolor="#4f46e5" style="border-radius:8px;">
                <a href="{{ $url }}"
                    style="display:inline-block; padding:15px 28px; color:#ffffff; font-size:15px; font-weight:bold; text-decoration:none;">
                    Restablecer mi contraseña
                </a>
            </td>
        </tr>
    </table>

    <p style="font-size:13px; line-height:22px; color:#64748b;">
        Este enlace tiene una validez limitada. Si vence, deberás solicitar
        uno nuevo desde JobPortal.
    </p>

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
        Si no solicitaste restablecer tu contraseña, podés ignorar este
        mensaje. Tu contraseña actual seguirá siendo la misma.
    </p>

    <p style="font-size:15px; color:#475569;">
        ¡Gracias por confiar en nosotros!
        <br>
        <strong>El equipo de JobPortal</strong>
    </p>
@endsection
