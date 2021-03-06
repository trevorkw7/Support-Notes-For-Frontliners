import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import SelectLocation from './assets/components/SelectLocation'
import SelectFrontliner from './assets/components/SelectFrontliner'
import WriteNote from './assets/components/WriteNote.js'
import { Box, Grid } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  cards:{
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3)
  },
  button: {
    margin: theme.spacing(1),
    flexGrow: 1,
  },
  nextbutton: {
    margin: theme.spacing(1),
    position: 'absolute',
    bottom: '10px',
    right: '175px'
  },
  backbutton: {
    margin: theme.spacing(1),
    position: 'absolute',
    bottom: '10px',
    right: '268px'
  },
  completed: {
    display: 'inline-block',
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  containerDiv: {
    margin: 'auto'
  },
  image: {
    flex: 0,
    width: null,
    height: null,
  },
  caption: {
    flex: 1,
    width: null,
    height: null,
  }
}));

function getSteps() {
  return ['Select a Frontliner', 'Select a Location', 'Write an Encouraging Note'];
}


export default function ProgressStepper(props) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});
  const [btnDisabled, setBtnDisabled] = React.useState(true)

  //Step 1:
  const [cardSelected, setCardSelected] = React.useState(null);
  //Step 2:
  const [facility, setFacility] = React.useState(null);
  //Step 3:
  const [noteContent, setNoteContent] = React.useState(null);
  const [senderName, setSenderName] = React.useState(null);

  const steps = getSteps();

  let formRef = props.firebase.db.ref('formData');

React.useEffect(()=>{
    if(noteContent !== null && senderName !==null && noteContent !== "" && senderName !== ""){
      setBtnDisabled(false)
    }
    else{
      setBtnDisabled(true)
    }
  }, [noteContent, senderName ])

  function getStepContent(step) {

    switch (step) {
      case 0:
        return <SelectFrontliner stepperCallback={handleFrontliner} />
      case 1:
        return <SelectLocation locationType={cardSelected} stepperCallback={handleLocation} />
      case 2:
        return <WriteNote stepperCallbackDescription={handleSender} stepperCallbackNote={handleNote} recipient={cardSelected} />
      default:
        return 'Unknown step'
    }
  }

  function handleFrontliner(frontlinerData) {
    setCardSelected(frontlinerData);
    handleComplete();
  }

  function handleLocation(locationData) {
    setFacility(locationData);
    handleComplete();
  }
  function handleNote(noteData) {
    if(noteData === ""){
      setNoteContent(null)
    }
    setNoteContent(noteData);
  }
  function handleSender(senderData) {
    if(senderData === ""){
      setSenderName(null)
    }
    setSenderName(senderData);
  }

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
        // find the first step that has been completed
        steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  // const handleBack = () => {

  //   setActiveStep((prevActiveStep) => prevActiveStep - 1);
  // };

  const handleStep = (step) => () => {
    console.log(step)
    if(getStepValue(step-1)!==null || step===0){
      setActiveStep(step);
    }
  };

  function getStepValue(step){
    switch (step) {
      case 0:
        return cardSelected
      case 1:
        return facility
      case 2:
        return [noteContent, senderName]
      default:
        return null;
    }
  }


  const handleSubmit = () => {
    handleComplete()
    // console.log(cardSelected)
    // console.log(facility)
    // console.log(noteContent)
    // console.log(senderName)
    let formData = {
      frontliner: cardSelected,
      facility: facility,
      note: noteContent,
      sender: senderName,
      approved: "false",
      sent: "false"
    }
    saveFormData(formData);
  }

  function saveFormData(data) {
    var newFormRef = formRef.push();
    newFormRef.set(data);
  }

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  // const handleReset = () => {
  //   setActiveStep(0);
  //   setCompleted({});
  // };

  // useEffect(()=>console.log(cardSelected), [cardSelected])
  // useEffect(()=>console.log(facility), [facility])

  return (
    <div className={classes.root}>
      <Stepper nonLinear activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepButton className onClick={handleStep(index)} completed={completed[index]}>
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <div className={classes.cards}>

        {allStepsCompleted() ? (
          <Grid container
            direction="column"
            alignItems="center"
            justify="center"
            style={{ minHeight: '50vh' }}
          >

            <Grid item xs={12} md={3}>

              <img alt='sending gif' className={classes.image} src='/images/sending.gif'/>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography align="center"className={classes.caption} variant="h6" >
                Thanks for writing a note! Your note will be mailed to your chosen facility soon.
              </Typography>
            </Grid>
          </Grid>
        ) : (
            <>
              <div>
                {/* <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography> */}
                {getStepContent(activeStep)}
              </div>
              <div>
                {/* <Button variant="contained" color="primary" className={classes.backbutton} disabled={activeStep === 0} onClick={handleBack}>
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            className={classes.nextbutton}
          >
            Next
          </Button>
          <> */}
                <br />
                {completedSteps() === totalSteps() - 1 ? <Box 
                display="flex" flexDirection="row-reverse"> 
                <Box p={1}><Button 
                disabled={btnDisabled}
                className={classes.button}
                 variant="contained" color="primary" 
                 onClick={handleSubmit}>
                   Submit
                 </Button>
                  </Box></Box> : null}
              </div>
            </>
          )
        }
      </div >
    </div >
  );
}
