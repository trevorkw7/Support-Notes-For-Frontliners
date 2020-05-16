import React from 'react';
import './App.css';
import ProgressStepper from './Stepper'
import { FireBaseContext } from './assets/components/FireBase';

function Note() {
  return (
    <div>
      <FireBaseContext.Consumer>
        {firebase => <ProgressStepper firebase={firebase} className="stepper"/>}
      </FireBaseContext.Consumer>
    </div>
  );
}

export default Note;
