import React, { useEffect, useState } from 'react'
import { Table, Grid, Label } from 'semantic-ui-react'
import { useSubstrateState } from './substrate-lib'

export default function Main(props) {
    const { api } = useSubstrateState()
    const [enclaves, setEnclaves] = useState({})
    let unsubscribeAll = null

    useEffect(() => {
        api.query.teerex.sovereignEnclaves.entries().then((enclaves) => {
            const p = enclaves.map(enclave => {
                return {
                    signer: enclave[0].toHuman(),
                    url: enclave[1].url,
                    fingerprint: enclave[1].fingerprint
                }
            })
            setEnclaves(p)
        })
            .then(unsub => {
            unsubscribeAll = unsub
        })
            .catch(console.error)
        return () => unsubscribeAll && unsubscribeAll()
    }, [api, setEnclaves()])

    return (
    <Grid.Column>
      <h1>Enclaves</h1>
      {enclaves.length === 0 ? (
        <Label basic color="yellow">
          No enclaves to be shown
        </Label>
      ) : (
        <Table celled striped size="small">
          <Table.Body>
            <Table.Row>
              <Table.Cell width={3} textAlign="right">
                <strong>Signer</strong>
              </Table.Cell>
              <Table.Cell width={10}>
                <strong>Url</strong>
              </Table.Cell>
              <Table.Cell width={3}>
                <strong>Fingerprint</strong>
              </Table.Cell>
            </Table.Row>
            {enclaves.map(enclave => (
              <Table.Row key={enclave.signer}>
                <Table.Cell width={3} textAlign="right">
                  {enclave.signer}
                </Table.Cell>
                <Table.Cell width={10}>
                  {enclave.url}
                </Table.Cell>
                <Table.Cell width={3}>
                    {enclave.fingerprint}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </Grid.Column>
    )
}
