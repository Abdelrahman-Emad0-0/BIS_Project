<?php

namespace Tests\Feature;

use App\Models\Message;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class MessageTest extends TestCase
{
    use RefreshDatabase;

    // ── Inbox ─────────────────────────────────────────────────────────────────

    public function test_user_can_view_their_inbox(): void
    {
        $sender   = User::factory()->create();
        $receiver = User::factory()->create();

        Message::create([
            'sender_id'   => $sender->id,
            'receiver_id' => $receiver->id,
            'content'     => 'Hello there!',
            'is_read'     => false,
        ]);

        Sanctum::actingAs($receiver);

        $response = $this->getJson('/api/messages/inbox');

        $response->assertStatus(200)
                 ->assertJson(['success' => true])
                 ->assertJsonCount(1, 'data');
    }

    public function test_inbox_does_not_show_sent_messages(): void
    {
        $sender   = User::factory()->create();
        $receiver = User::factory()->create();

        Message::create([
            'sender_id'   => $sender->id,
            'receiver_id' => $receiver->id,
            'content'     => 'A message I sent',
            'is_read'     => false,
        ]);

        Sanctum::actingAs($sender);  // acting as the SENDER

        $response = $this->getJson('/api/messages/inbox');

        $response->assertStatus(200)
                 ->assertJsonCount(0, 'data');  // sender's inbox is empty
    }

    public function test_inbox_requires_authentication(): void
    {
        $this->getJson('/api/messages/inbox')->assertStatus(401);
    }

    // ── Sent ──────────────────────────────────────────────────────────────────

    public function test_user_can_view_their_sent_messages(): void
    {
        $sender   = User::factory()->create();
        $receiver = User::factory()->create();

        Message::create([
            'sender_id'   => $sender->id,
            'receiver_id' => $receiver->id,
            'content'     => 'Test sent message',
            'is_read'     => false,
        ]);

        Sanctum::actingAs($sender);

        $response = $this->getJson('/api/messages/sent');

        $response->assertStatus(200)
                 ->assertJson(['success' => true])
                 ->assertJsonCount(1, 'data');
    }

    public function test_sent_only_shows_messages_sent_by_authenticated_user(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();
        $userC = User::factory()->create();

        Message::create(['sender_id' => $userA->id, 'receiver_id' => $userB->id, 'content' => 'A to B', 'is_read' => false]);
        Message::create(['sender_id' => $userC->id, 'receiver_id' => $userB->id, 'content' => 'C to B', 'is_read' => false]);

        Sanctum::actingAs($userA);

        $response = $this->getJson('/api/messages/sent');

        $response->assertStatus(200)
                 ->assertJsonCount(1, 'data');
    }

    // ── Store ─────────────────────────────────────────────────────────────────

    public function test_user_can_send_a_message(): void
    {
        $sender   = User::factory()->create();
        $receiver = User::factory()->create();

        Sanctum::actingAs($sender);

        $response = $this->postJson('/api/messages', [
            'receiver_id' => $receiver->id,
            'content'     => 'Hello, I want to learn PHP!',
        ]);

        $response->assertStatus(201)
                 ->assertJson(['success' => true, 'message' => 'Message sent successfully']);

        $this->assertDatabaseHas('messages', [
            'sender_id'   => $sender->id,
            'receiver_id' => $receiver->id,
            'content'     => 'Hello, I want to learn PHP!',
            'is_read'     => 0,
        ]);
    }

    public function test_message_sender_is_always_the_authenticated_user(): void
    {
        $sender   = User::factory()->create();
        $receiver = User::factory()->create();
        $thirdParty = User::factory()->create();

        Sanctum::actingAs($sender);

        // Even if we try to impersonate thirdParty, sender_id must be the authenticated user
        $response = $this->postJson('/api/messages', [
            'receiver_id' => $receiver->id,
            'content'     => 'Testing sender assignment',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('messages', ['sender_id' => $sender->id]);
        $this->assertDatabaseMissing('messages', ['sender_id' => $thirdParty->id]);
    }

    public function test_sending_message_requires_receiver_and_content(): void
    {
        $sender = User::factory()->create();
        Sanctum::actingAs($sender);

        $this->postJson('/api/messages', [])->assertStatus(422);
    }

    public function test_sending_message_to_nonexistent_user_fails(): void
    {
        $sender = User::factory()->create();
        Sanctum::actingAs($sender);

        $this->postJson('/api/messages', [
            'receiver_id' => 99999,
            'content'     => 'Hello?',
        ])->assertStatus(422);
    }

    public function test_sending_message_requires_authentication(): void
    {
        $receiver = User::factory()->create();

        $this->postJson('/api/messages', [
            'receiver_id' => $receiver->id,
            'content'     => 'Should fail',
        ])->assertStatus(401);
    }

    // ── Mark As Read ──────────────────────────────────────────────────────────

    public function test_receiver_can_mark_message_as_read(): void
    {
        $sender   = User::factory()->create();
        $receiver = User::factory()->create();

        $message = Message::create([
            'sender_id'   => $sender->id,
            'receiver_id' => $receiver->id,
            'content'     => 'Read me',
            'is_read'     => false,
        ]);

        Sanctum::actingAs($receiver);

        $response = $this->putJson("/api/messages/{$message->id}/read");

        $response->assertStatus(200)
                 ->assertJson(['success' => true, 'message' => 'Message marked as read']);

        $this->assertDatabaseHas('messages', ['id' => $message->id, 'is_read' => 1]);
    }

    public function test_sender_cannot_mark_their_own_message_as_read(): void
    {
        $sender   = User::factory()->create();
        $receiver = User::factory()->create();

        $message = Message::create([
            'sender_id'   => $sender->id,
            'receiver_id' => $receiver->id,
            'content'     => 'Not my message to read',
            'is_read'     => false,
        ]);

        Sanctum::actingAs($sender);

        $this->putJson("/api/messages/{$message->id}/read")
             ->assertStatus(404);  // only receiver can mark it as read
    }

    public function test_unrelated_user_cannot_mark_message_as_read(): void
    {
        $sender    = User::factory()->create();
        $receiver  = User::factory()->create();
        $outsider  = User::factory()->create();

        $message = Message::create([
            'sender_id'   => $sender->id,
            'receiver_id' => $receiver->id,
            'content'     => 'Private message',
            'is_read'     => false,
        ]);

        Sanctum::actingAs($outsider);

        $this->putJson("/api/messages/{$message->id}/read")
             ->assertStatus(404);
    }
}
