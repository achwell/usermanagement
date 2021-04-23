import React from 'react';
import TypoGraphy from '@material-ui/core/Typography'
import actuatorService from "../../service/actuator.service";
import authenticationService from "../../service/autehentication.service";

const INITIAL_STATE = {
    systemStatus: 'DOWN',
    dbType: '',
    dbStatus: 'DOWN',
    systemHealth: {},
    systemCpu: 0,
    timestamp: 0
};

class Systemstatus extends React.Component {

    state = INITIAL_STATE

    componentDidMount() {
        if(this.props.intervalID) {
            clearInterval(this.props.intervalID);
        }
        this.reloadData(true);
    }

    componentWillUnmount() {
        clearInterval(this.props.intervalID);
    }

    updateTime = () => {
        return setInterval(() => {
            this.setState((prevState, props) => ({timestamp: prevState.timestamp + 1}));
        }, 1000);
    }

    reloadData = async (updateTime) => {
        if(authenticationService.isLoggedIn()) {
            const {systemStatus, dbType, dbStatus, diskSpace} = await this.getSystemHealth();
            const timestamp = await this.getProcessUpTime();
            const systemCpu = await this.getSystemCPU();
            this.setState({systemStatus, dbType, dbStatus, diskSpace, timestamp, systemCpu});
            if(updateTime) {
                const intervalID = this.updateTime();
                this.props.setIntervalID(intervalID);
            }
        }
    }

    getSystemHealth = async () => {
        const response = await actuatorService.getSystemHealth().catch();
        const systemHealth = response.data;
        const dbComponent = systemHealth.components.db;
        const diskSpaceComponent = systemHealth.components.diskSpace;

        const systemStatus = systemHealth.status;
        const dbType = dbComponent.details.database
        const dbStatus = dbComponent.status;
        const diskSpace = diskSpaceComponent.details.free;
        return {systemStatus, dbType, dbStatus, diskSpace};
    }

    getProcessUpTime = async () => {
        const response = await actuatorService.getProcessUpTime().catch();
        return response.data.measurements[0].value;
    }

    getSystemCPU = async () => {
        const response = await actuatorService.getSystemCPU().catch();
        return response.data.measurements[0].value;
    }

    formatBytes = bytes => {
        if (bytes === 0) {
            return '0 Bytes';
        }
        const k = 1024;
        const dm = 2 < 0 ? 0 : 2;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    formateUptime = timestamp => {
        const hours = Math.floor(timestamp / 60 / 60);
        const minutes = Math.floor(timestamp / 60) - (hours * 60);
        const seconds = Math.round(timestamp % 60);
        return hours.toString().padStart(2, '0') + 'h ' + minutes.toString().padStart(2, '0') + 'm ' + seconds.toString().padStart(2, '0') + 's';
    }

    render() {
        if(!authenticationService.hasAuthority("system:status")) {
            return null;
        }
        const {timestamp, diskSpace, dbType, dbStatus, systemStatus, systemCpu} = this.state;
        const {ok, error} = this.props.classes;
        return (
            <>
                <TypoGraphy variant="caption" className={this.props.classes.caption}>
                    System: <span className={systemStatus.endsWith("UP") ? ok : error}>{systemStatus}</span>
                </TypoGraphy>
                <TypoGraphy variant="caption" className={this.props.classes.caption}>
                    DB: <em>{dbType}</em> - <span className={dbStatus.endsWith("UP") ? ok : error}>{dbStatus}</span>
                </TypoGraphy>
                <TypoGraphy variant="caption" className={this.props.classes.caption}>
                    Disk Space: <span
                    className={Math.round(diskSpace / 1024 / 1024 / 1024) > 1 ? ok : error}>{this.formatBytes(this.state.diskSpace)}</span>
                </TypoGraphy>
                <TypoGraphy variant="caption" className={this.props.classes.caption}>
                    Processors: <span className={systemCpu > 2 ? ok : error}>{systemCpu}</span>
                </TypoGraphy>
                <TypoGraphy variant="caption" className={this.props.classes.caption}>
                    Up Time: <span>/{this.formateUptime(timestamp)}</span>
                </TypoGraphy>
            </>
        );
    }
}

export default Systemstatus;
