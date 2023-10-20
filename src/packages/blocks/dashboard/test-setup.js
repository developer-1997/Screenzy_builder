// test-setup.js
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });


jest.mock(
    'react-native-simple-toast',
    () => {
        return{
        }
    },
    {virtual: true},
  );
  jest.mock(
    "react-native-advertising-id",
    () => {
        return{
        RNAdvertisingId: jest.fn().mockImplementation(() => Promise.resolve()),
        }
    },
    {virtual: true},
  );
  jest.mock(
    'react-native-countdown-circle-timer',
    () => {
        return{
        }
    },
    {virtual: true},
  );
  jest.mock(
    'react-native-triangle',
    () => {
        return{
        }
    },
    {virtual: true},
  );
