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
                    signer: enclave[0].toHuman()[0].signer.Opaque.slice(0,(32)*2+2), //assume signer is a 32bit key
                    registrar: enclave[0].toHuman()[0].registrar,
                    url: enclave[1].toHuman().Sgx.url,
                    fingerprint: enclave[1].toHuman().Sgx.mrEnclave,
                    vendor: enclave[1].toHuman().Sgx.mrSigner,
                    buildMode: enclave[1].unwrap().asSgx.buildMode.type,
                    reportData : enclave[1].unwrap().asSgx.reportData.d,
                    attestationMethod: enclave[1].unwrap().asSgx.attestationMethod.type,
                    attestationStatus: enclave[1].unwrap().asSgx.status.type,
                    attestationTimestamp: new Date( enclave[1].unwrap().asSgx.timestamp * 1).toString(),
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
                    <p>{enclave.signer}</p>
                    <p>(proxied by) {enclave.registrar}</p>
                </Table.Cell>
                <Table.Cell width={10}>
                  {enclave.url}
                </Table.Cell>
                <Table.Cell width={3}>
                    <p>fingerprint (MRENCALVE): {enclave.fingerprint}</p>
                    <p>vendor (MRSIGNER): {enclave.vendor}</p>
                    <p>build mode: {enclave.buildMode}</p>
                    <p>attestation: method: {enclave.attestationMethod}, status: {enclave.attestationStatus}</p>
                    <p>attestation timestamp: {enclave.attestationTimestamp}</p>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </Grid.Column>
    )
}
