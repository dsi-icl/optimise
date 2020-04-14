import React, { PureComponent } from 'react';
import scaffold_style from '../scaffoldStyle.module.css';

export class VisitFrontPageIntroduction extends PureComponent {
    render() {
        return (
            <div className={`${scaffold_style.padding_div} ${scaffold_style.center_introduction_div}`}>
                <p>You will be guided to enter the essential data for this visit in steps.</p>
                <br/>
                <p>You will be able to navigate forward and backward to each form and make changes using the navigation button at the bottom of such page.</p>
                <p>Don't worry if you discover you have entered wrong data after you clicked "Finish", you will be able to edit these data afterwards in the patients homepage.</p><br /><br />
                <p style={{ color: 'red' }}>Please note that clicking next page does not automatically save your data in forms where you have to fill out data fields. You will have to click "save" or "submit" button in the form.</p>
                <p>If you understand, please click "Start" to enter data.</p>
            </div>
        );
    }
}

