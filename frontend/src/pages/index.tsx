
import { Typography } from '@mui/material';

import { MainLayout } from '@/components/layouts';

export default function HomePage() {
    return (
        <MainLayout title='Camba v0.1'>
            <Typography variant='h1' component='h1'>
                Camba
            </Typography>
            <Typography variant='h2' sx={{ mb: 1 }}>
                Gestión digital de prácticas médicas
            </Typography>
        </MainLayout>
    );
}
