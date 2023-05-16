import React, {useCallback, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Voice from '@react-native-voice/voice';
import {
  Alert,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import {useData, useTheme, useTranslation} from '../hooks/';
import axios from 'axios';
import {
  dlManelToUnicode,
  singlishToUnicode,
  unicodeToDlManel,
} from 'sinhala-unicode-coverter';
import {Block, Switch, Image, Text} from '../components/';

const Home = () => {
  const {t} = useTranslation();
  const [isDark, setIsDark] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const {colors, assets, sizes} = useTheme();
  const {handleIsDark} = useData();
  const navigation = useNavigation();
  const [symptoms, setSymptoms] = useState<any>('');
  const [tags, setTags] = useState<any>([]);
  
  const apiEndpoint = 'https://backend-ap.herokuapp.com/app/text';

  const fetchSynonyms = async () => {
    
    
        const response = await axios.post(apiEndpoint, {
          text: symptoms,
          isSinhala: isDark,
        }).then((response) => {
          console.log(response.data);
          setTags(response.data.symptoms)
          
        }).catch((error) => {
          console.log(error);
        })
      
     
    
  };

  const onSaveButtonPressed = async () => {

      const synonyms:any = await fetchSynonyms();
     
      // Handle error if API request fails
    
  };

  const convertTextToSinhala = (text:any) => {
    if (isDark) {
      // Convert the text to Sinhala using the desired conversion function
      return singlishToUnicode(text);
    } else {
      // If the toggle is off, return the original English text
      return text;
    }
  };

  useEffect(() => {
    if (isRecording) {
      Voice.start('en-US');
    } else {
      Voice.stop();
    }
  }, [isRecording]);

  const onStartRecording = useCallback(() => {
    setIsRecording(true);
  }, []);

  const onStopRecording = useCallback(() => {
    setIsRecording(false);
  }, []);

  Voice.onSpeechStart = () => {
    setRecognizedText('');
  };

  Voice.onSpeechResults = (event:any) => {
    console.log(event.value[0]);
    setRecognizedText(event.value[0]);
  };

  const clearTextInput = () => {
    setRecognizedText('');
  };
  const renderTag = ({item}: {item: string}) => {
    return (
      <View
        style={{
          backgroundColor: '#666967',
          borderRadius: 5,
          paddingHorizontal: 10,
          paddingVertical: 5,
          margin: 2,
          flex: 1,
        }}>
        <Text color={colors.card} numberOfLines={1} ellipsizeMode='tail'>
          {item}
        </Text>

      </View>
    );
  };
  
  return (
    <Block color={colors.card}>
      <ScrollView>
        <Block
          row
          flex={0}
          justify="center"
          paddingBottom={sizes.sm}
          color={colors.card}>
          <Text h3>Disease Prediction</Text>
        </Block>
        <Block
          row
          flex={0}
          justify="space-between"
          color={colors.card}
          paddingRight={sizes.sm}>
          <View style={{flex: 1}} />
          <Text p marginRight={sizes.s}>
            English
          </Text>
          <Switch
            marginRight={sizes.s}
            checked={isDark}
            onPress={(checked) => {
              setIsDark(checked);
            }}
          />
          <Text p>Sinhala</Text>
        </Block>

        <Block
          row
          flex={0}
          paddingBottom={sizes.sm}
          color={colors.card}
          padding={sizes.padding}>
          <TextInput
            placeholder="Type symptoms here"
            placeholderTextColor={colors.gray}
            style={{
              width: '100%',
              borderWidth: 1,
              borderRadius: 20,
              textAlignVertical: 'top',
              paddingTop: 20,
              paddingBottom: 20,
              paddingLeft: 20,
              paddingRight: 10,
              maxHeight: 180,
              height: 180,
            }}
            value={isRecording ? '' : recognizedText} // Use the converted text when not recording
            onChangeText={(text) => {
              let convertedText = text;
              
              setRecognizedText(convertedText);
              setSymptoms(text);
            }}
            multiline={true}
          />
        </Block>

        <Block row flex={0} color={colors.card} paddingRight={20}>
          <View style={{flex: 1}} />

          <TouchableOpacity onPress={clearTextInput}>
            <Image
              source={assets?.dustbin}
              style={{
                width: 60,
                height: 60,
              }}
            />
          </TouchableOpacity>
        </Block>

        <Block row flex={0} color={colors.card} paddingBottom={sizes.sm}>
        <FlatList
  data={tags}
  renderItem={renderTag}
  keyExtractor={(item:any, index:any) => index.toString()}
  numColumns={3}
  contentContainerStyle={{padding: sizes.padding}}
  style={{flex: 1}}
/>

        </Block>

        <Block
          flex={0}
          color={colors.card}
          paddingBottom={sizes.sm}
          alignItems="center">
          <TouchableOpacity
            onPress={isRecording ? onStopRecording : onStartRecording}>
            <Image
              source={assets?.mic}
              style={{
                width: 80,
                height: 80,
                marginBottom: 10,
              }}
            />
          </TouchableOpacity>
          <Text p style={{marginBottom: 1}}>
            {isRecording ? 'Recording...' : 'start recording'}
          </Text>
        </Block>

        <Block
          row
          flex={0}
          justify="center"
          paddingBottom={sizes.sm}
          color={colors.card}>
          <TouchableOpacity
            onPress={onSaveButtonPressed}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 12,
              paddingHorizontal: 40,
              borderRadius: 40,
              backgroundColor: 'red',
              borderWidth: 1,
              borderColor: 'red',
              elevation: 5, // Add elevation for shadow effect
            }}>
            <Text h5 white marginHorizontal={sizes.s}>
              Save
            </Text>
          </TouchableOpacity>
        </Block>

        <Block
          row
          flex={0}
          justify="center"
          paddingBottom={sizes.sm}
          color={colors.card}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Update',{text: symptoms,tags: tags})}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 12,
              paddingHorizontal: 40,
              borderRadius: 40,
              backgroundColor: 'green',
              borderWidth: 1,
              borderColor: 'green',
              elevation: 5, // Add elevation for shadow effect
            }}>
            <Text h5 white marginHorizontal={sizes.s}>
              Next
            </Text>
          </TouchableOpacity>
        </Block>
      </ScrollView>
    </Block>
  );
};

export default Home;
