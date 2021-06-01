import '../App.css';
import React, { useEffect, useState } from 'react';
import Constants from '../utils/Constants';

const JiraHolder = () => {

    const [state, setState] = useState({
        jiras: [],
        lastRowId: 0
    });

    /**
     * On initial page load, check if the old state is cached in local storage.
     * If nothing is found there, just show one empty row by calling the "reset" function.
     */
    useEffect(() => {
        const stateFromLocalStorage = localStorage.getItem(Constants.localStorageKey);
        if(stateFromLocalStorage) {
            setState(JSON.parse(stateFromLocalStorage));
        } else {
            resetRows();
        }
    }, [])

    /**
     * Store the state to the local storage whenever it changes.
     * If the browser session was closed or refreshed, the user can continue from where they left.
     */
    useEffect(() => {
        console.log("jasTrace: JIRAS state changed. Logging it");
        console.log(state);
        localStorage.setItem(Constants.localStorageKey, JSON.stringify(state));
    })

    const addRow = () => {
        const rowid = state.lastRowId + 1;
        var tempJiraStateHolder = state.jiras;
        tempJiraStateHolder.push(getJiraWithCustomRowId(rowid));
        setState({
            jiras: tempJiraStateHolder,
            lastRowId: rowid
        });
    }

    const deleteRow = (rowid) => {
        console.log(rowid);
        if (state.jiras.length > 1) {
            // filter out anything that does not match the provided rowid
            const remainders = state.jiras.filter((jira) => (jira.rowid !== rowid));
            setState({
                jiras: remainders,
                lastRowId: state.lastRowId
            });
        } else {
            alert("Cannot delete the last row");
        }
    }

    const resetRows = () => {
        setState({
            jiras: [getJiraWithCustomRowId(0)],
            lastRowId: 0
        });
    }

    const getJiraWithCustomRowId = (customRowId) => {
        // You need to clone the JSON object instead of making a reference to it using the "=" operator
        const aJira = JSON.parse(JSON.stringify(Constants.initialJiraValues));
        aJira.rowid = customRowId;
        return aJira;
    }

    const getResultLine = (jira) => {
        if(jira.summary != "") {
        return (
            <p key={jira.rowid}>- { jira.summary } / description:"{jira.description}" priority:"{jira.priority}" assignee:"{jira.assignee}" fixversion:"{jira.fixversion}" cfield:"DevPriority:{jira.devpriority}"</p>
        )
        }
    }

const handleInputChanged = (event) => {
    // get the name and value of the field that was updated
    const { name, value } = event.target;

    // rowid is stored as "id" in the <tr> element which has the input field
    const rowid = parseInt(event.target.parentNode.parentNode.id);

    // update the value by matching the rowid
    var tempJiraStateHolder = state.jiras;
    for (var i = 0; i < tempJiraStateHolder.length; i++) {
        var aJira = tempJiraStateHolder[i];
        if (aJira.rowid === rowid) {
            aJira[name] = value;
        }
    }

    // update the state
    setState({
        jiras: tempJiraStateHolder,
        lastRowId: state.lastRowId
    });
}

return (
    <div>
        <table id="jiraholdertable" className="table table-striped" border="1" width="100%">
            <thead>
                <tr>
                    <th>Jira Summary</th>
                    <th>Description</th>
                    <th>Priority</th>
                    <th>Assignee</th>
                    <th>Fix Version</th>
                    <th>Dev Priority</th>
                    <th>Deletions</th>
                </tr>
            </thead>
            <tbody>
                {
                    state.jiras.map(
                        (jira) =>
                            <tr key={jira.rowid} id={jira.rowid}>
                                <td><input name="summary" value={jira.summary} onChange={handleInputChanged}></input></td>
                                <td><textarea name="description" value={jira.description} onChange={handleInputChanged}></textarea></td>
                                <td>
                                    <select name="priority" value={jira.priority} onChange={handleInputChanged}>
                                        <option value="@inherit">Inherit</option>
                                        <option value="blocker">Blocker</option>
                                        <option value="critical">Critical</option>
                                        <option value="major">Major</option>
                                        <option value="minor">Minor</option>
                                        <option value="trivial">Trivial</option>
                                    </select>
                                </td>
                                <td>
                                    <select name="assignee" value={jira.assignee} onChange={handleInputChanged}>
                                        <option value="@current">Me</option>
                                        <option value="@inherit">Inherit</option>
                                    </select>
                                </td>
                                <td>
                                    <select name="fixversion" value={jira.fixversion} onChange={handleInputChanged}>
                                        <option value="@inherit">Inherit</option>
                                    </select>
                                </td>
                                <td>
                                    <select name="devpriority" value={jira.devpriority} onChange={handleInputChanged}>
                                        <option value="@inherit">Inherit</option>
                                    </select>
                                </td>
                                <td><button onClick={function () { deleteRow(jira.rowid) }}>Delete Row</button></td>
                            </tr>
                    )
                }
            </tbody>
        </table>
        <button onClick={addRow}>Add Sub-task</button>
        <button onClick={resetRows}>Reset</button>
        <h5>Results:</h5>
        {
            state.jiras.map(
                (jira) => getResultLine(jira)
            )
        }
        <h5>How it works:</h5>
        <ol>
            <li>Copy the text from the Results above</li>
            <li>Go to your parent JIRA</li>
            <li>Click on More → Create multiple sub-tasks</li>
            <li>Paste the content you copied from this page above</li>
            <li>Click on "Create Sub-Tasks"</li>
        </ol>
        <a className="github-fork-ribbon right-top" href="https://github.com/anushibin007/jira-bulk-sub-task-creator" data-ribbon="Fork me on GitHub" title="Fork me on GitHub">Fork me on GitHub</a>
    </div>
)
}

export default JiraHolder;