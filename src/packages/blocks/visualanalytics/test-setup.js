// test-setup.js
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

jest.mock(
    'react-google-charts',
    () => {
        return{
            Chart: jest.fn().mockImplementation(() => Promise.resolve()),
        }
    },
    {virtual: true},
  );