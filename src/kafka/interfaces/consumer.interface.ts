/**
 * Interface defining the common methods for a generic Kafka consumer.
 */
export interface IConsumer {
  /**
   * Connects the consumer to the Kafka cluster.
   * @returns A promise that resolves when the connection is established.
   */
  connect: () => Promise<void>;

  /**
   * Disconnects the consumer from the Kafka cluster.
   * @returns A promise that resolves when the consumer is disconnected.
   */
  disconnect: () => Promise<void>;

  /**
   * Starts consuming messages.
   * @param onMessage - A callback function that is called for each received message.
   * The message type depends on the specific consumer implementation.
   * @returns A promise that resolves when consumption is stopped.
   */
  consume: (onMessage: (message: any) => Promise<void>) => Promise<void>;
}
