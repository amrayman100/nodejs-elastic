import React from 'react'
import { Switch, Route ,BrowserRouter} from 'react-router-dom'
import ElasticChart from './components/ElasticChart';
import ElasticSearch from './components/ElasticSearch';

const MainRoutes = () => (

  <main>
    <BrowserRouter>
      <Switch>
        <Route exact path='/Chart' 
            render={(props) => <ElasticChart/>}/>
      </Switch>

      <Switch>
        <Route exact path='/Search' 
            render={(props) => <ElasticSearch/>}/>
      </Switch>
         
    </BrowserRouter>
  

  </main>
)

export default MainRoutes