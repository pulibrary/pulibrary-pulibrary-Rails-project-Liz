# frozen_string_literal: true

require "rails_helper"

describe "accessibility testing:", type: :feature, js: true do
  user = FactoryBot.create(:user)
  user_id = user.id

  # context "home page" do
  #   before do
  #     visit "/"
  #   end

  #   it "complies with wcag" do
  #     expect(page).to be_axe_clean
  #       .according_to(:wcag2a, :wcag2aa, :wcag21a, :wcag21aa)
  #   end
  # end

  # context "authenticate page" do
  #   before do
  #     visit "/authenticate"
  #   end
  #   it "complies with wcag2aa wcag21a" do
  #     expect(page).to be_axe_clean
  #       .according_to(:wcag2a, :wcag2aa, :wcag21a, :wcag21aa)
  #   end
  # end

  # context "profile page" do
  #   before do
  #     visit "/access_profile?user_id=#{user_id}"
  #   end

  #   it "complies with wcag" do
  #     expect(page).to be_axe_clean
  #       .according_to(:wcag2a, :wcag2aa, :wcag21a, :wcag21aa)
  #   end
  # end

  # context "edit profile page" do
  #   before do
  #     visit "/users/#{user_id}/edit"
  #   end

  #   it "complies with wcag" do
  #     expect(page).to be_axe_clean
  #       .according_to(:wcag2a, :wcag2aa, :wcag21a, :wcag21aa)
  #   end
  # end

  # context "create account page" do
  #   before do
  #     visit "/create_account"
  #   end

  #   it "complies with wcag" do
  #     expect(page).to be_axe_clean
  #       .according_to(:wcag2a, :wcag2aa, :wcag21a, :wcag21aa)
  #   end
  # end

  # context "score board page" do
  #   before do
  #     visit "/scoreboard"
  #   end

  #   it "complies with wcag" do
  #     expect(page).to be_axe_clean
  #       .according_to(:wcag2a, :wcag2aa, :wcag21a, :wcag21aa)
  #   end
  # end

  # context "list of players page" do
  #   before do
  #     visit "/list_players"
  #   end

  #   it "complies with wcag" do
  #     expect(page).to be_axe_clean
  #       .according_to(:wcag2a, :wcag2aa, :wcag21a, :wcag21aa)
  #   end
  # end

  context "connect4 game page" do
    before do
      redUser = FactoryBot.create(:user)
      yellowUser = FactoryBot.create(:user)
      visit "/connect4"

      numberOfRounds = (rand(1..6) * 2) - 1
      accept_prompt(with: numberOfRounds.to_s) do
        # click_on "OK"
      end
    
      # expect(page).to have_button("OK") 
      accept_prompt(with: redUser.username) do
      end

      # expect(page).to have_button("OK") 
      accept_prompt(with: yellowUser.username) do
      end
    end

    it "complies with wcag" do
      expect(page).to be_axe_clean
        .according_to(:wcag2a, :wcag2aa, :wcag21a, :wcag21aa)
    end
  end
end
