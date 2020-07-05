import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { createLogEntries } from './API';

const LogEntryForm = ({ location, onClose }) => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { register, handleSubmit, watch, errors } = useForm();

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            data.longitude = location.longitude;
            data.latitude = location.latitude;
            console.log(data);
            const response = await createLogEntries(data);
            console.log(response);
            onClose();
        } catch (error) {
            setError(error.message);
            console.log(error);   
        }
    }

    return (
        <>
            <form className="entry-form" onSubmit={handleSubmit(onSubmit)} >
                {error ? <h3 className="error">{error}</h3> : null}
                <label htmlFor="title" >Title</label>
                <input name="title" ref={register} required />
                <label htmlFor="comments" >Comments</label>
                <textarea name="comments" rows={3} ref={register} />
                <label htmlFor="description" >Description</label>
                <textarea name="description" ref={register} />
                <label htmlFor="image" >Image</label>
                <input name="image" ref={register} />
                <label htmlFor="visitDate" >Visit Date</label>
                <input name="visitDate" type="date" ref={register} required />
                <button disabled={loading} > {loading ? 'Loading...' : 'Create Entry'} </button>
            </form>
        </>
    )
}

export default LogEntryForm;