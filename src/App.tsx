import React from 'react';
import {Layout} from 'antd';
import './App.less';
import 'antd/dist/antd.less';
import Navbar from './components/Navbar';
import "./i18n/config";
import MenuBar from './components/MenuBar';
import Loader from './components/Loader';
import {useRoutes} from 'react-router';
import routes from './router';
import {AuthProvider} from "./Auth/RequireAuth";

function App() {
    let element = useRoutes(routes);
    return (
        <AuthProvider>
            <Layout style={{minHeight: '100vh'}}>
                <>
                    <Navbar/>
                    <Layout>
                        <MenuBar/>
                        <Layout>
                            <Loader element={element}/>
                        </Layout>
                    </Layout>
                </>
            </Layout>
        </AuthProvider>
    );
}

export default App;
