import { Timestamp, addDoc, collection } from 'firebase/firestore';

import { Button, Flex, Input } from '@chakra-ui/react';
import { useState } from 'react';

import db from '@/lib/init-firebase';
import { useAppSelector } from '@/states/hooks';

import './ChatEditor.css';

const ChatEditor: React.FC<{}> = () => {
  // Space Slice
  const { username } = useAppSelector((state) => state.authSlice);

  const spaceId = useAppSelector((state) =>
    state.spaceDetailSlice.data.id?.toString()
  );

  const [message, setMessage] = useState('');

  const handleSendMessage = async () => {
    if (message.trim().length === 0 || !spaceId) return;
    await addDoc(collection(db, spaceId), {
      date: Timestamp.fromDate(new Date()),
      message,
      username,
    });

    setMessage(''); // reset
  };

  return (
    <Flex w="95%" mt="5" mb="5" align="center" justify="center">
      <Input
        placeholder="Type Something..."
        border="none"
        borderRadius="none"
        borderTop="1px solid black"
        borderLeft="1px solid black"
        borderRight="1px solid black"
        borderBottom="1px solid black"
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            void handleSendMessage();
          }
        }}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button
        bg="#B1B2FF"
        color="white"
        borderRadius="none"
        _hover={{
          bg: 'white',
          color: 'black',
          border: '1px solid black',
        }}
        disabled={message.trim().length <= 0}
        onClick={() => {
          void handleSendMessage();
        }}
      >
        Send
      </Button>
    </Flex>
  );
};

export default ChatEditor;
