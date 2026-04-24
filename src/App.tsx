import { BrowserRouter } from 'react-router-dom';
import { ModulesProvider } from './providers/modules-provider';

const { BASE_URL } = import.meta.env;

const App = () => (
  <BrowserRouter basename={BASE_URL}>
    <ModulesProvider />
  </BrowserRouter>
);

export default App
