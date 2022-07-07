/**
 * Sample React Native Home
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import type {Node} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';

import {
  ConnectionStateChangedEvent,
  ConnectionEventTypes,
  ConnectionRecord,
} from '@aries-framework/core';

import {useAgent} from '@aries-framework/react-hooks';
import axios from 'axios';
import Config from 'react-native-config';

import {Colors} from 'react-native/Libraries/NewAppScreen';

const Home: () => Node = () => {
  const backgroundStyle = {
    backgroundColor: Colors.lighter,
    flex: 1,
    flexGrow: 1,
  };

  const [isInvitationReceived, setIsInvitationReceived] = useState(false);
  const [inviteUrl, setInviteUrl] = useState('');
  const {agent} = useAgent();
  const [connectionDetails, setConnectionDetails] =
    useState<ConnectionRecord>();
  const [connectionRecord, setConnectionRecord] = useState<ConnectionRecord>();

  const receiveInvite = async () => {
    let resp = await axios.post(
      Config.ISSUER_CONNECTION_INVITATION_ENDPOINT,
      {},
    );
    console.log(resp.data.invitation_url);
    setInviteUrl(resp.data.invitation_url);
    setIsInvitationReceived(true);
  };

  useEffect(() => {
    const receiveInvitation = async () => {
      console.log('Creating connection');
      let {connectionRecord, outOfBandRecord} =
        await agent?.oob.receiveInvitationFromUrl(inviteUrl, {
          autoAcceptConnection: true,
          autoAcceptInvitation: true,
        })!;
      if (connectionRecord) {
        setConnectionDetails(connectionRecord);
      }
    };

    if (isInvitationReceived && inviteUrl && inviteUrl != '') {
      receiveInvitation();
    }
  }, [inviteUrl, isInvitationReceived, agent]);

  useEffect(() => {
    agent?.events.on<ConnectionStateChangedEvent>(
      ConnectionEventTypes.ConnectionStateChanged,
      event => {
        setConnectionRecord(event.payload.connectionRecord);
        console.log('This is agent event: ', event);
      },
    );
  }, [agent]); // eslint-disable-line react-hooks/exhaustive-deps

  //   useEffect(() => {
  //     getConnectionRecord = async () => {
  //       let record = await agent.connections.getById(connectionDetails.id);
  //       setConnectionRecord(record);
  //     };
  //     if (connectionDetails) {
  //       getConnectionRecord();
  //     }
  //   }, [connectionDetails]);

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1, padding: 10}}>
        <View
          style={{flex: 1, alignContent: 'center', justifyContent: 'center'}}>
          <TouchableOpacity
            style={{
              backgroundColor: 'blue',
              alignSelf: 'center',
              padding: 15,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 5,
            }}
            onPress={receiveInvite}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>
              ReceiveInvitationFromIssuer
            </Text>
          </TouchableOpacity>
          {inviteUrl ? (
            <View>
              <Text style={{fontSize: 20, marginTop: 10}}>
                Invitation received:
              </Text>
              <Text style={{fontSize: 12, marginTop: 5}}>
                https://issuerUrl?{inviteUrl.split('?')[1]}
              </Text>
            </View>
          ) : (
            <></>
          )}
        </View>
        {connectionRecord ? (
          <View style={{flex: 1}}>
            <Text style={{fontSize: 24}}>Connection Details{'\n'}</Text>
            <Text style={{fontSize: 18}}>Connection Id:</Text>
            <Text
              style={{
                fontSize: 22,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {connectionRecord.id}
            </Text>
            <Text style={{fontSize: 18}}>Connection Status:</Text>
            <Text style={{fontSize: 24}}>{connectionRecord.state}</Text>
          </View>
        ) : (
          <></>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default Home;
