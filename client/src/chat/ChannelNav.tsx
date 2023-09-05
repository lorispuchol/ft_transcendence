import { Add, Close, Search } from "@mui/icons-material";
import { FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, IconButton, Switch, TextField } from "@mui/material";
import { ChangeEvent, useState } from "react";
import './chat.css'

function CreateChanForm() {
  const [strings, setStrings] = useState({
    name: "",
    password: "",
  });

  const [check, setCheck] = useState({
	private: false
  });


  const changeCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheck({
      ...check,
      [event.target.name]: event.target.checked,
    });
  };

  const changeStrings = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStrings({
      ...strings,
      [event.target.name]: event.target.value,
    });
  };

  function createChannel() {

  }

  return (
    <FormControl component="fieldset" variant="standard">
      <FormLabel component="legend">Create your own channel</FormLabel>
      <FormGroup>
        <FormControlLabel
          control={
            <TextField value={strings.name} onChange={changeStrings} name="name" />
          }
          label=""
        />
        <FormControlLabel
          control={
            <Switch checked={check.private} onChange={changeCheck} name="private" />
          }
          label="turn on to make your chennal private"
		//   labelPlacement="start"
        />
		{
			check.private === true ?
				<FormControlLabel
				control={
					<TextField  value={strings.password} onChange={changeStrings} name="password" />
				}
				label=""
				/> 
			: null
		}
        
		<IconButton><Add/></IconButton>
      </FormGroup>
    </FormControl>
  );
}


export default function ChannelNav() {

	return (
		<div className="chan-nav">
			
			<button>
				<Search />
			</button>
			
			<div className="create-chan-form">

				{/* <form onSubmit={createChan}>
					<TextField type="text" value={chanName} autoFocus placeholder="Channel Name" onChange={chanNameChange} />
					<Switch aria-label=""/>
				</form>
				<select name="mode" value={mode} id="mode-select" onChange={modeChange}>
					<option value="">--Please choose an option--</option>
					<option value="public">Public</option>
					<option value="protected">Protected</option>
					<option value="private">Private</option>
				</select>
				<form onSubmit={createChan}>
					<input className="bg-transparent" type="password" value={password} placeholder="PASSWORD" onChange={passwordChange} />
				</form> */}
				<CreateChanForm />
				{/* <div>
					<button  onClick={() => createChan()}>CREATE CHAN</button>
				</div> */}
			</div>
		</div>
	)
}
