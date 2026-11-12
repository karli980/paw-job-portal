import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useRef } from 'react';
import {
    Bold,
    Heading2,
    Heading3,
    Italic,
    Link2,
    List,
    ListOrdered,
    Redo2,
    Strikethrough,
    Underline,
    Undo2,
    Unlink,
} from 'lucide-react';

type Props = {
    value: string;
    onChange: (html: string) => void;
    disabled?: boolean;
};

const LIMITE_TEXTO = 5000;
const estiloBoton =
    'inline-flex size-9 items-center justify-center rounded-md border border-transparent text-slate-600 transition hover:border-slate-200 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40';

/** Las descripciones existentes pueden estar guardadas como texto plano. */
function prepararContenido(value: string): string {
    if (!value.trim()) return '<p></p>';

    // Reconocer los elementos generados por Tiptap, no tratar texto ordinario como HTML.
    if (/^\s*<(?:p|h[1-6]|ul|ol|blockquote|pre|div|strong|em|br|a)\b/i.test(value)) {
        return value;
    }

    const escapar = (text: string) =>
        text.replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;');

    return value.split(/\r?\n/).map((line) => `<p>${line ? escapar(line) : '<br>'}</p>`).join('');
}

export function DescripcionEditor({ value, onChange, disabled = false }: Props) {
    // Guardamos la callback vigente sin recrear el editor al escribir.
    const alCambiar = useRef(onChange);
    useEffect(() => {
        alCambiar.current = onChange;
    }, [onChange]);

    const editor = useEditor({
        immediatelyRender: false, // Compatible con la configuración SSR de Inertia.
        shouldRerenderOnTransaction: true, // Actualizar estados de la barra de formato.
        extensions: [
            StarterKit.configure({
                heading: { levels: [2, 3] },
                link: {
                    openOnClick: false,
                    autolink: true,
                    HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' },
                },
            }),
        ],
        content: prepararContenido(value),
        editable: !disabled,
        editorProps: {
            attributes: {
                'aria-label': 'Descripción de la empresa',
                spellcheck: 'true',
            },
        },
        onUpdate: ({ editor: instancia }) => {
            alCambiar.current(instancia.isEmpty ? '' : instancia.getHTML());
        },
    });

    // Sincronizar nuevas props tras un guardado/visita Inertia sin destruir la selección.
    useEffect(() => {
        if (!editor) return;
        const actual = editor.isEmpty ? '' : editor.getHTML();
        const siguiente = prepararContenido(value);
        if (actual !== value && actual !== siguiente) {
            editor.commands.setContent(siguiente, { emitUpdate: false });
        }
    }, [editor, value]);

    useEffect(() => {
        editor?.setEditable(!disabled);
    }, [editor, disabled]);

    function agregarEnlace() {
        if (!editor || disabled) return;
        const hrefActual = editor.getAttributes('link').href as string | undefined;
        const respuesta = window.prompt('URL del enlace (http:// o https://):', hrefActual ?? 'https://');
        if (respuesta === null) return;
        const url = respuesta.trim();
        if (!url) {
            editor.chain().focus().unsetLink().run();
            return;
        }
        try {
            const enlace = new URL(url);
            if (enlace.protocol !== 'https:' && enlace.protocol !== 'http:') {
                throw new Error('Esquema no permitido');
            }
            editor.chain().focus().extendMarkRange('link').setLink({ href: enlace.href }).run();
        } catch {
            window.alert('Ingresá una dirección válida que comience con https:// o http://.');
        }
    }

    if (!editor) {
        return (
            <div className="mt-2 min-h-44 rounded-lg border border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                Preparando el editor…
            </div>
        );
    }

    const caracteres = editor.getText({ blockSeparator: '\n' }).length;
    const excedido = caracteres > LIMITE_TEXTO;

    const botones = [
        { etiqueta: 'Negrita', Icono: Bold, activo: editor.isActive('bold'), ejecutar: () => editor.chain().focus().toggleBold().run() },
        { etiqueta: 'Cursiva', Icono: Italic, activo: editor.isActive('italic'), ejecutar: () => editor.chain().focus().toggleItalic().run() },
        { etiqueta: 'Subrayado', Icono: Underline, activo: editor.isActive('underline'), ejecutar: () => editor.chain().focus().toggleUnderline().run() },
        { etiqueta: 'Tachado', Icono: Strikethrough, activo: editor.isActive('strike'), ejecutar: () => editor.chain().focus().toggleStrike().run() },
        { etiqueta: 'Subtítulo', Icono: Heading2, activo: editor.isActive('heading', { level: 2 }), ejecutar: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
        { etiqueta: 'Título menor', Icono: Heading3, activo: editor.isActive('heading', { level: 3 }), ejecutar: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
        { etiqueta: 'Viñetas', Icono: List, activo: editor.isActive('bulletList'), ejecutar: () => editor.chain().focus().toggleBulletList().run() },
        { etiqueta: 'Lista numerada', Icono: ListOrdered, activo: editor.isActive('orderedList'), ejecutar: () => editor.chain().focus().toggleOrderedList().run() },
    ];

    return (
        <div className="mt-2">
            <div className="overflow-hidden rounded-lg border border-slate-300 bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/15">
                <div role="toolbar" aria-label="Formato de descripción empresarial" className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 p-2">
                    {botones.map(({ etiqueta, Icono, activo, ejecutar }) => (
                        <button
                            key={etiqueta}
                            type="button"
                            title={etiqueta}
                            aria-label={etiqueta}
                            aria-pressed={activo}
                            disabled={disabled}
                            onClick={ejecutar}
                            className={`${estiloBoton} ${activo ? 'bg-indigo-100 text-indigo-700' : ''}`}
                        >
                            <Icono className="size-4" />
                        </button>
                    ))}
                    <span className="mx-1 h-6 w-px bg-slate-200" aria-hidden="true" />
                    <button type="button" title="Insertar enlace" aria-label="Insertar enlace" disabled={disabled} onClick={agregarEnlace} className={estiloBoton}>
                        <Link2 className="size-4" />
                    </button>
                    <button type="button" title="Quitar enlace" aria-label="Quitar enlace" disabled={disabled} onClick={() => editor.chain().focus().unsetLink().run()} className={estiloBoton}>
                        <Unlink className="size-4" />
                    </button>
                    <span className="mx-1 h-6 w-px bg-slate-200" aria-hidden="true" />
                    <button type="button" title="Deshacer" aria-label="Deshacer" disabled={disabled || !editor.can().chain().undo().run()} onClick={() => editor.chain().focus().undo().run()} className={estiloBoton}>
                        <Undo2 className="size-4" />
                    </button>
                    <button type="button" title="Rehacer" aria-label="Rehacer" disabled={disabled || !editor.can().chain().redo().run()} onClick={() => editor.chain().focus().redo().run()} className={estiloBoton}>
                        <Redo2 className="size-4" />
                    </button>
                </div>
                <EditorContent
                    editor={editor}
                    className="min-h-44 px-4 py-3 text-sm leading-6 text-slate-800 [&_.ProseMirror]:min-h-36 [&_.ProseMirror]:outline-none [&_p]:mb-3 [&_h2]:my-3 [&_h2]:text-lg [&_h2]:font-bold [&_h3]:my-2 [&_h3]:font-semibold [&_ul]:ml-5 [&_ul]:list-disc [&_ol]:ml-5 [&_ol]:list-decimal [&_li]:my-1 [&_blockquote]:border-l-4 [&_blockquote]:border-indigo-200 [&_blockquote]:pl-3 [&_a]:text-indigo-600 [&_a]:underline"
                />
            </div>
            <div className="mt-2 flex justify-end text-xs">
                <span role="status" className={excedido ? 'font-semibold text-red-600' : 'text-slate-500'}>
                    {caracteres.toLocaleString('es-AR')} / {LIMITE_TEXTO.toLocaleString('es-AR')} caracteres
                    {excedido ? ' — Superaste el máximo permitido.' : ''}
                </span>
            </div>
        </div>
    );
}
