/**
 * Interface defining the common methods for a generic Kafka producer.
 */
export interface IProducer {
  /**
   * Connects the producer to the Kafka cluster.
   * @returns A promise that resolves when the connection is established.
   */
  connect: () => Promise<void>;

  /**
   * Disconnects the producer from the Kafka cluster.
   * @returns A promise that resolves when the producer is disconnected.
   */
  disconnect: () => Promise<void>;

  /**
   * Sends a message to a Kafka topic.
   * @param message - The message to be sent. The actual type of the message depends on the specific producer implementation.
   * (usually `ProducerRecord{}`)
   * @returns A promise that resolves when the message is sent successfully.
   */
  produce: (message: any) => Promise<void>;
}
