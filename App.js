import { Context } from './src/contexts/Context';

import StackNavigator from './src/navigator/StackNavigator';

const App = () =>
{
    return (
        <>
            <Context>
                <StackNavigator />
            </Context>
        </>
    );
}

export default App;
