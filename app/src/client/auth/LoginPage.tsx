import { Center, Box, Link } from '@chakra-ui/react';
import { LoginForm } from 'wasp/client/auth';
// Wasp's type-safe Link component
import { Link as RRLink } from 'wasp/client/router';
import authAppearance from './authAppearance';

export function LoginPage() {
  return (
    <Center>
      <Box mt={5}>
        <LoginForm appearance={authAppearance} />
        <Box ml={3}>
          <span className='inline-block mt-1 text-primary'>
            I don't have an account yet (
            <Link as={RRLink} to='/signup' textDecoration='underline'>
              go to signup
            </Link>
            )
          </span>
        </Box>
      </Box>
    </Center>
  );
}
