import {
  Agent,
  AutoAcceptCredential,
  HttpOutboundTransport,
  MediatorPickupStrategy,
  WsOutboundTransport,
} from '@aries-framework/core';
import AgentProvider from '@aries-framework/react-hooks';
import {agentDependencies} from '@aries-framework/react-native';
import Config from 'react-native-config';
import React, {useEffect, useRef, useState} from 'react';
import networks from './Network';

import {frameworkLogger} from './FrameworkLogger';

const FrameworkProvider: React.FC = props => {
  const [agent, setAgent] = useState<Agent | undefined>(undefined);
  const agentRef = useRef<Agent>();

  const initAgent = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000)); // wait if there is previous agent shutdown to be completed
    if (agent && agent.isInitialized) {
      await agent.shutdown();
    }
    const newAgent = new Agent(
      {
        indyLedgers: [networks[0]],
        label: 'di-wallet',
        mediatorConnectionsInvite: Config.MEDIATOR_MULTIUSE_INVITE,
        mediatorPickupStrategy: MediatorPickupStrategy.Implicit,
        walletConfig: {id: 'di-wallet', key: 'test-key'},
        autoAcceptCredentials: AutoAcceptCredential.ContentApproved,
        logger: frameworkLogger((message: string) => {
          if (Config.ENABLE_DEBUG === 'true') {
            //addLog(message);
          }
        }),
        useLegacyDidSovPrefix: true,
      },
      agentDependencies,
    );

    const wsTransport = new WsOutboundTransport();
    const httpTransport = new HttpOutboundTransport();

    newAgent.registerOutboundTransport(wsTransport);
    newAgent.registerOutboundTransport(httpTransport);

    await newAgent.initialize();

    agentRef.current = newAgent;
    setAgent(newAgent);
  };

  useEffect(
    () => () => {
      console.log(
        '--- Shutting down Agent from wallet name or network effect ---',
      );
      agentRef.current?.shutdown();
    },
    [],
  );

  useEffect(() => {
    if (networks && networks.length > 0) {
      console.log('--- Init Agent from wallet name or network effect ---');
      initAgent();
    }
  }, [networks]); // eslint-disable-line react-hooks/exhaustive-deps

  return <AgentProvider agent={agent}>{props.children}</AgentProvider>;
};

export default FrameworkProvider;
