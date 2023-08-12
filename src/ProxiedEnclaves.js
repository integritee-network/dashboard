import React, { useEffect, useState } from 'react'
import { Table, Grid, Label } from 'semantic-ui-react'
import { useSubstrateState } from './substrate-lib'

export default function Main(props) {
    const { api } = useSubstrateState()
    const [proxiedEnclaves, setProxiedEnclaves] = useState([])
    let unsubscribeAll = null

    useEffect(() => {
        api.query.teerex.proxiedEnclaves.entries().then((enclaves) => {
            const e = enclaves.map(enclave => {
                return {
                    signer: enclave[0].toHuman().signer,
                    url: enclave[1].toHuman().Sgx.url,
                    fingerprint: enclave[1].toHuman().Sgx.mrEnclave,
                    buildMode: enclave[1].toHuman().Sgx.buildMode,
                }
            })
            setProxiedEnclaves(e)
        })
            .then(unsub => {
            unsubscribeAll = unsub
        })
            .catch(console.error)
        return () => unsubscribeAll && unsubscribeAll()
    }, [api])

    return (
    <Grid.Column>
      <h1>Proxied Enclaves</h1>
      {proxiedEnclaves.length === 0 ? (
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
                <strong>Properties</strong>
              </Table.Cell>
            </Table.Row>
            {proxiedEnclaves.map(enclave => (
              <Table.Row key={enclave.signer}>
                <Table.Cell width={3} textAlign="right">
                  {enclave.signer}
                </Table.Cell>
                <Table.Cell width={10}>
                  {enclave.url}
                </Table.Cell>
                <Table.Cell width={3}>
                    <p>MRENCALVE: {enclave.fingerprint}</p>
                    <p>attestation method: {enclave.attestationMethod}</p>
                    <p>build mode: {enclave.buildMode}</p>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </Grid.Column>
    )
}
