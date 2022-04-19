import React, { useContext, useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { ContegrisCallWidget } from "../contegrisCall";
import { UserContext } from "../../context";
import { toggleViopCallWidget } from '../../actions/appActions';

const ContegrisCall = ({ assignedAgent, intelliconUser }) => {

    const [contegrisCallWidgetVisible, setContegrisCallWidgetVisible] = useState(false);
    const [calling, setCalling] = useState(false);

    const { showCallWidget } = useSelector(state => state.callWidgetReducer);

    let dispatch = useDispatch();

    useEffect(() => {
        dispatch(toggleViopCallWidget(false));
    }, []);

    const showContegrisCallWidget = () => {
        dispatch(toggleViopCallWidget(true));
        setCalling(true);
        setContegrisCallWidgetVisible(true);
    };

    const closeContegrisCallWidget = () => {
        dispatch(toggleViopCallWidget(false));
        setCalling(false);
        setContegrisCallWidgetVisible(false);
    };
    const user = useContext(UserContext);
    return (
        <>
            <ContegrisCallWidget
                visible={contegrisCallWidgetVisible}
                onClose={closeContegrisCallWidget}
                intelliconUser={intelliconUser}
            />

            <button
                disabled={calling || assignedAgent && assignedAgent.id !== user._id || assignedAgent === undefined || assignedAgent === null || showCallWidget}
                onClick={showContegrisCallWidget}
                className="btn btn-voipcall"
            >
                {calling ? "Calling" : "Call"}
            </button>
        </>
    );
}
export default ContegrisCall;

