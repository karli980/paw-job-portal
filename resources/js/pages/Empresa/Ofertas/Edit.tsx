import OfertaLaboralForm, { type Props, type OfertaExistente } from '@/components/ofertas/OfertaLaboralForm';

type PageProps = Omit<Props, 'modo' | 'oferta'> & {
    oferta: OfertaExistente;
};

export default function Edit(props: PageProps) {
    return <OfertaLaboralForm {...props} modo="editar" />;
}
