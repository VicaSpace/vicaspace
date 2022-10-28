import { Avatar, Flex, Text, VStack } from '@chakra-ui/react';

const UserCell: React.FC = () => {
  return (
    <VStack w="80%">
      <Avatar
        name="Computer"
        src="https://avataaars.io/?avatarStyle=Transparent&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light"
        bg="blue.300"
      ></Avatar>
      <Text>Test</Text>
    </VStack>
  );
};

export default UserCell;
