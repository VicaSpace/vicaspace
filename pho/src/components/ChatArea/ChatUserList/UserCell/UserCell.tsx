import PropTypes from 'prop-types';

import { Avatar, Text, VStack } from '@chakra-ui/react';

const UserCell: React.FC<{ username: string }> = ({ username }) => {
  return (
    <VStack>
      <Avatar
        src={`https://i.pravatar.cc/150?u=${username}`}
        bg="blue.300"
      ></Avatar>
      <Text>{username}</Text>
    </VStack>
  );
};

UserCell.propTypes = {
  username: PropTypes.string.isRequired,
};

export default UserCell;
