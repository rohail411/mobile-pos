// material-ui
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

// ==============================|| FOOTER - AUTHENTICATION ||============================== //

export default function AuthFooter() {
  return (
    <Container maxWidth="xl">
      <Stack direction="row" justifyContent="center">
        <Typography variant="subtitle2" color="secondary">
          Mobile Shop Manager &mdash; runs fully offline on this computer
        </Typography>
      </Stack>
    </Container>
  );
}
