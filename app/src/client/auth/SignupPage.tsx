import { Center, Box, Link } from '@chakra-ui/react';
import { SignupForm } from 'wasp/client/auth';
// Wasp's type-safe Link component
import { Link as RRLink } from 'wasp/client/router';
import authAppearance from './authAppearance';

export function SignupPage() {
  return (
    <Center>
      <Box mt={5}>
        <SignupForm appearance={authAppearance} />
        <Box ml={3}>
          <span className='inline-block mt-1 text-primary'>
            I already have an account (
            <Link as={RRLink} textDecoration='underline' to='/login'>
              go to login
            </Link>
            )
          </span>
        </Box>
      </Box>
    </Center>
  );
}
