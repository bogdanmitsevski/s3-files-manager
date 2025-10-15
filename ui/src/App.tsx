import React from 'react';
import './App.css';
import Router from '@components/AppRouter';

const MemoizedAppRouter = React.memo(Router);

function App() {

  return (
    <>
      <MemoizedAppRouter />
    </>
  );
}

export default App;
