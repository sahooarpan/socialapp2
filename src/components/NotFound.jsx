import React from 'react'
import Page from './Page'
import { Link} from 'react-router-dom'

const NotFound = () => {
    return (
        <Page title="Not Found">
            <div className="text-center">
                <h2>Whoops can't find the page</h2>
                <p className="text-muted lead">
                    You can always visit the <Link to="/">HomePage</Link> to get a fresh start
                </p>
            </div>
        </Page>
    )
}

export default NotFound
