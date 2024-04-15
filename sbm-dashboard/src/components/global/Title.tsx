import { Route, Routes } from 'react-router-dom'


function Title(): JSX.Element {
    return (
    <div>
        <Routes>
            <Route path='/' element={<h1>Operations</h1>} />
            <Route path='/dynamic-scheduling' element={<h1>Dynamic Scheduling</h1>} />
            <Route path='/sales-forecast' element={<h1>Sales Forecast</h1>} />
            <Route path='/accounts' element={<h1>Accounts</h1>} />
        </Routes>
    </div>
    )
}

export default Title;