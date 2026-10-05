import { AppRegistry } from 'react-native';
import Ionicons from 'react-native-vector-icons/Fonts/Ionicons.ttf';
import App from './App';
import { name as appName } from './app.json';

const iconFontStyles = `@font-face { src: url(${Ionicons}); font-family: Ionicons; }`;
const styleElement = document.createElement('style');
styleElement.appendChild(document.createTextNode(iconFontStyles));
document.head.appendChild(styleElement);

AppRegistry.registerComponent(appName, () => App);
AppRegistry.runApplication(appName, { rootTag: document.getElementById('root') });
